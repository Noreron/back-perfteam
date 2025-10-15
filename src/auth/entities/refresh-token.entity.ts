import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tokenHash: string;

  @ManyToOne(() => User, (u) => u.refreshTokens)
  user: User;

  // store expiry as milliseconds since epoch for cross-database compatibility
  @Column({ type: 'bigint' })
  expiresAt: number;

  @CreateDateColumn()
  createdAt: Date;
}
