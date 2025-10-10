import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class AssessmentSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 10})
  slug: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => Question, (q: Question) => q.session, { cascade: true })
  questions: Question[];
}
