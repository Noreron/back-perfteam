import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssessmentSession } from './entities/assessment-session.entity';
import { Question } from './entities/question.entity';
import { QuestionResult } from './entities/question-result.entity';
import { SessionDto } from './dto/create-session.dto';
import { QuestionResultDto } from './dto/question-result.dto';
import { CreateAssessmentDto } from './dto/CreateAssessmentDto';
import { Assessment } from './entities/assessment.entity';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectRepository(Assessment)
    private assessmentRepo: Repository<Assessment>,
    @InjectRepository(AssessmentSession)
    private sessionRepo: Repository<AssessmentSession>,
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
    @InjectRepository(QuestionResult)
    private resultRepo: Repository<QuestionResult>,
  ) { }


  listAssessment(): Promise<Assessment[]> {
    return this.assessmentRepo.find();
  }

  async createAssessment(dto: CreateAssessmentDto): Promise<Assessment> {
    const assessment = this.assessmentRepo.create({
      title: dto.title,
      description: dto.description,
    });
    if (dto.questions && dto.questions.length) {
      assessment.questions = dto.questions.map((q) => this.questionRepo.create({ text: q.text, category: q.category }));
    }
    return this.assessmentRepo.save(assessment);
  }

  async createSession(dto: SessionDto): Promise<AssessmentSession> {

    const assessment = await this.assessmentRepo.findOne({ 
        where: { 
            id: dto.idAssessment 
        }
    });

    if (!assessment) {
      throw new Error('Assessment non trouvé');
    }

    const session = this.sessionRepo.create({
      slug: this.randomSlug(6),
      assessment: assessment,
    });

    return this.sessionRepo.save(session)
  }

  async sendUserResult(dto: QuestionResultDto) {

  }

  async getQuestions(sessionId: string): Promise<Question[]> {
    const session = await this.sessionRepo.findOne({
      where: { slug: sessionId },
      relations: ['assessment', 'assessment.questions']
    });

    if (!session) {
      throw new Error('Session non trouvée');
    }
    return session.assessment.questions;
  }

  async getResults(sessionId: number): Promise<QuestionResult[]> {
    return this.resultRepo.find({ where: { question: { session: { slug: sessionId } } } as any, relations: ['question'] });
  }


  randomSlug(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

}
