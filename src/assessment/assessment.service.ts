import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssessmentSession } from './entities/assessment-session.entity';
import { Question } from './entities/question.entity';
import { QuestionResult } from './entities/question-result.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { QuestionResultDto } from './dto/question-result.dto';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectRepository(AssessmentSession)
    private sessionRepo: Repository<AssessmentSession>,
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
    @InjectRepository(QuestionResult)
    private resultRepo: Repository<QuestionResult>,
  ) {}

  listSessions(): Promise<AssessmentSession[]> {
    return this.sessionRepo.find();
  }

  async createSession(dto: CreateSessionDto): Promise<AssessmentSession> {
    const session = this.sessionRepo.create({
      title: dto.title,
      description: dto.description,
      slug: this.randomSlug(5),
    });
    if (dto.questions && dto.questions.length) {
      session.questions = dto.questions.map((q) => this.questionRepo.create({ text: q.text, category: q.category }));
    }
    return this.sessionRepo.save(session);
  }

  async sendUserResult(dto: QuestionResultDto)
  {
    //dto.answers

  }

  async getQuestions(sessionId: string): Promise<Question[]> {
    return this.questionRepo.find({ where: { session: { slug: sessionId } } as any });
  }

  async getResults(sessionId: number): Promise<QuestionResult[]> {
    return this.resultRepo.find({ where: { question: { session: { slug: sessionId } } } as any, relations: ['question'] });
  }


  randomSlug(length: number){
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

}
