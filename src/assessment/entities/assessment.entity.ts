import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Question } from './question.entity';
import { AssessmentSession } from './assessment-session.entity';

@Entity()
export class Assessment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => Question, (q: Question) => q.assessment, { cascade: true })
  questions: Question[];

  @OneToMany(() => AssessmentSession, (s: AssessmentSession) => s.assessment, { cascade: true })
  sessions: AssessmentSession[];
  
}
