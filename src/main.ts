import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthMiddleware } from './middleware/auth';
import { JwtService } from '@nestjs/jwt';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const jwtService = app.get(JwtService);
  const authMiddleware = new AuthMiddleware(jwtService);

  const config = new DocumentBuilder()
    .setTitle('AppleTree Api')
    .setDescription('AppleTree API description')
    .setVersion('1.0')
    .addTag('AppleTree')
    .build();
  // Api doc = 4444/api
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  });

  // app.use(authMiddleware.use.bind(authMiddleware));

  app.use(express.static(join(__dirname, '..', 'public')));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(4444);
}
bootstrap();
