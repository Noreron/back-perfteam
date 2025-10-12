import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {

    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.enableCors({
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:4000',
      credentials: true,
    });

   const config = new DocumentBuilder()
    .setTitle('Perfteam')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);


  await app.listen(3000);
}
bootstrap();
