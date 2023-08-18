import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthMiddleware } from './middleware/auth';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const jwtService = app.get(JwtService);
  const authMiddleware = new AuthMiddleware(jwtService);
  app.use(authMiddleware.use.bind(authMiddleware));
  await app.listen(4444);
}
bootstrap();
