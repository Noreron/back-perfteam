import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class QuestionResult {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Question, (q: Question) => q.results)
  question: Question;

  @Column({ type: 'int' })
  score: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;
}
