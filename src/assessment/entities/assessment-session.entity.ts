import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Question } from './question.entity';
import { Assessment } from './assessment.entity';

@Entity()
export class AssessmentSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 10})
  slug: string;

  @ManyToOne(() => Assessment, (assessment) => assessment.sessions)
  assessment: Assessment;
}
