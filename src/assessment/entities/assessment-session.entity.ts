import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Assessment } from './assessment.entity';

@Entity()
export class AssessmentSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 10})
  slug: string;

  @Column({length: 250})
  title: string;

  @ManyToOne(() => Assessment, (assessment) => assessment.sessions)
  assessment: Assessment;
}
