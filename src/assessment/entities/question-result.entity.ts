import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { Question } from './question.entity';
import { AssessmentSession } from './assessment-session.entity';

@Entity()
@Index(['session', 'question'])
export class QuestionResult {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AssessmentSession, { nullable: false, onDelete: 'CASCADE' })
  session: AssessmentSession;

  @ManyToOne(() => Question, (q: Question) => q.results, { nullable: false, onDelete: 'CASCADE' })
  question: Question;

  @Column({ type: 'float' })
  value: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @CreateDateColumn()
  createdAt: Date;
}
