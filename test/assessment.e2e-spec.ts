// Use in-memory sqlite for e2e to avoid needing a local MySQL instance
process.env.DB_TYPE = process.env.DB_TYPE || 'sqlite';
process.env.DB_NAME = ':memory:';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Assessment submissions e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 20000);

  afterAll(async () => {
    await app.close();
  });

  it('creates assessment, session, submits answers and returns averages', async () => {
    // create assessment with 2 questions
    const createResp = await request(app.getHttpServer())
      .post('/assessment/create')
      .send({ title: 'E2E Test', description: 'desc', questions: [{ text: 'Q1' }, { text: 'Q2' }] })
      .expect(201);

    const assessment = createResp.body;
    expect(assessment).toHaveProperty('id');
    expect(assessment.questions.length).toBe(2);

    // create session
    const sessionResp = await request(app.getHttpServer())
      .post('/assessment/session')
      .send({ idAssessment: assessment.id })
      .expect(201);

    const session = sessionResp.body;
    expect(session).toHaveProperty('slug');

    // submit answers: Q1 -> 3, Q2 -> 5; submit twice for two respondents
    const answers1 = {
      answers: [
        { questionId: assessment.questions[0].id, value: 3 },
        { questionId: assessment.questions[1].id, value: 5 },
      ],
      respondentId: 'r1',
    };

    const answers2 = {
      answers: [
        { questionId: assessment.questions[0].id, value: 5 },
        { questionId: assessment.questions[1].id, value: 7 },
      ],
      respondentId: 'r2',
    };

    await request(app.getHttpServer())
      .post(`/assessment/${session.slug}/submissions`)
      .send(answers1)
      .expect(201);

    await request(app.getHttpServer())
      .post(`/assessment/${session.slug}/submissions`)
      .send(answers2)
      .expect(201);

    // get averages
    const avgResp = await request(app.getHttpServer())
      .get(`/assessment/${session.slug}/results/average`)
      .expect(200);

  const averages: any[] = avgResp.body;
  // find averages by question
  const avgByQ1 = averages.find((a: any) => a.questionId === assessment.questions[0].id);
  const avgByQ2 = averages.find((a: any) => a.questionId === assessment.questions[1].id);

    expect(avgByQ1).toBeDefined();
    expect(avgByQ2).toBeDefined();
    expect(avgByQ1.average).toBeCloseTo((3 + 5) / 2, 5);
    expect(avgByQ2.average).toBeCloseTo((5 + 7) / 2, 5);
  }, 40000);
});
