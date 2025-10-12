import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { AssessmentSession } from './assessment-session.entity';
import { QuestionResult } from './question-result.entity';
import { Assessment } from './assessment.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  text: string;

  @Column({ length: 250, nullable: true })
  category?: string;

  @ManyToOne(() => Assessment, (q: Assessment) => q.questions)
  assessment: Assessment;

  @OneToMany(() => QuestionResult, (r: QuestionResult) => r.question)
  results: QuestionResult[];
}
