import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';

import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private tokenRepo: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new Error('Email already used');
    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ email: dto.email, passwordHash: hash });
    return this.userRepo.save(user);
  }

  private signAccessToken(user: User) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: process.env.JWT_ACCESS_TTL || '15m' });
  }

  private async createRefreshTokenInDb(user: User) {
    const token = require('crypto').randomBytes(64).toString('hex');
    const tokenHash = await bcrypt.hash(token, 10);
  const expiresIn = process.env.JWT_REFRESH_TTL || '7d';
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // default 7d in ms
    const rt = this.tokenRepo.create({ tokenHash, user, expiresAt });
    await this.tokenRepo.save(rt);
    return { token, expiresAt };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const accessToken = this.signAccessToken(user);
    const { token: refreshToken, expiresAt } = await this.createRefreshTokenInDb(user);
    return { accessToken, refreshToken, refreshExpiresAt: expiresAt };
  }

  async refresh(refreshTokenPlain: string) {
    if (!refreshTokenPlain) throw new UnauthorizedException();
    const tokens = await this.tokenRepo.find({ relations: ['user'] });
    // find token by comparing hashes (inefficient but simple)
    for (const t of tokens) {
      const match = await bcrypt.compare(refreshTokenPlain, t.tokenHash);
      if (match) {
        if (Number(t.expiresAt) < Date.now()) {
          await this.tokenRepo.remove(t);
          throw new UnauthorizedException('Refresh token expired');
        }
        const user = t.user;
        // rotate: remove old token and create new one
        await this.tokenRepo.remove(t);
  const { token: newRefresh, expiresAt } = await this.createRefreshTokenInDb(user);
        const accessToken = this.signAccessToken(user);
        return { accessToken, refreshToken: newRefresh, refreshExpiresAt: expiresAt };
      }
    }
    throw new UnauthorizedException('Invalid refresh token');
  }

  async logout(refreshTokenPlain: string) {
    if (!refreshTokenPlain) return;
    const tokens = await this.tokenRepo.find({ relations: ['user'] });
    for (const t of tokens) {
      const match = await bcrypt.compare(refreshTokenPlain, t.tokenHash);
      if (match) {
        await this.tokenRepo.remove(t);
        return;
      }
    }
  }
}
