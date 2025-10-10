import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentController } from './assessment.controller';
import { AssessmentService } from './assessment.service';
import { AssessmentSession } from './entities/assessment-session.entity';
import { Question } from './entities/question.entity';
import { QuestionResult } from './entities/question-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssessmentSession, Question, QuestionResult])],
  controllers: [AssessmentController],
  providers: [AssessmentService],
})
export class AssessmentModule {}
