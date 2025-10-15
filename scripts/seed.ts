import { DataSource } from 'typeorm';
import { Assessment } from '../src/assessment/entities/assessment.entity';
import { Question } from '../src/assessment/entities/question.entity';
import { AssessmentSession } from '../src/assessment/entities/assessment-session.entity';

async function run() {
  const ds = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'perfteam',
    entities: [Assessment, Question, AssessmentSession],
  });
  await ds.initialize();

  const repo = ds.getRepository(Assessment);
  const a = repo.create({ title: 'Seeded', description: 'seed' });
  a.questions = [ds.getRepository(Question).create({ text: 'Q1' }), ds.getRepository(Question).create({ text: 'Q2' })];
  await repo.save(a);

  const sessionRepo = ds.getRepository(AssessmentSession);
  const s = sessionRepo.create({ slug: 'seed1', assessment: a });
  await sessionRepo.save(s);

  console.log('seeded', a.id, s.slug);
  await ds.destroy();
}

run().catch(err => { console.error(err); process.exit(1); });
