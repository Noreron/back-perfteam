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
            id: dto.idAssessment,
        }
    });

    if (!assessment) {
      throw new Error('Assessment non trouvé');
    }

    const session = this.sessionRepo.create({
      slug: this.randomSlug(6),
      assessment: assessment,
      title: dto.title,
    });

    return this.sessionRepo.save(session)
  }

  async sendUserResult(dto: QuestionResultDto) {
    // validate session exists
    const session = await this.sessionRepo.findOne({ where: { slug: dto.sessionSlug } });
    if (!session) throw new Error('Session not found');

    const questionIds = dto.answers.map(a => a.questionId);
    const questions = await this.questionRepo.findByIds(questionIds);
    const foundIds = new Set(questions.map(q => q.id));
    for (const id of questionIds) {
      if (!foundIds.has(id)) throw new Error(`Question ${id} not found`);
    }

    const resultsToSave = dto.answers.map(a => this.resultRepo.create({
      session: session,
      question: questions.find(q => q.id === a.questionId),
      value: a.value,
      comment: a.comment,
    }));

    return this.resultRepo.save(resultsToSave);
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

  // return average value per question for a session (by session slug)
  async getAveragesByQuestion(sessionSlug: string) {
    const qb = this.resultRepo.createQueryBuilder('r')
      .select('r.questionId', 'questionId')
      .addSelect('AVG(r.value)', 'avg')
      .innerJoin('r.session', 's')
      .where('s.slug = :slug', { slug: sessionSlug })
      .groupBy('r.questionId');

    const rows = await qb.getRawMany();
    // map questionId -> avg
    return rows.map(r => ({ questionId: Number(r.questionId), average: Number(r.avg) }));
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
