import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	email: string;

	@Column()
	passwordHash: string;

	@Column('simple-array', { nullable: true })
	roles?: string[];

	@OneToMany(() => RefreshToken, (r: RefreshToken) => r.user)
	refreshTokens: RefreshToken[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
