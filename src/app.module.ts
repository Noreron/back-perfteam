import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AssessmentModule } from './assessment/assessment.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const type = (process.env.DB_TYPE as any) || 'mysql';
        const common: any = {
          type,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
        if (type === 'sqlite') {
          return {
            ...common,
            database: process.env.DB_NAME || ':memory:',
          };
        }
        // default mysql
        return {
          ...common,
          host: process.env.DB_HOST || 'localhost',
          port: Number(process.env.DB_PORT) || 3306,
          username: process.env.DB_USER || 'root',
          password: process.env.DB_PASS || '',
          database: process.env.DB_NAME || 'perfteam',
        };
      },
    }),
    AssessmentModule,
    AuthModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
