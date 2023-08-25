import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthMiddleware } from './middleware/auth';
import { JwtService } from '@nestjs/jwt';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const jwtService = app.get(JwtService);
  const authMiddleware = new AuthMiddleware(jwtService);

  app.enableCors({
    origin: [
      'http://127.0.0.1:5500',
      'http://127.0.0.1:5501',
      'http://localhost:4444',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  });

  app.use(authMiddleware.use.bind(authMiddleware));

  app.use(express.static(join(__dirname, '..', 'public')));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(4444);
}
bootstrap();
