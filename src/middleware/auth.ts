// import {
//   Injectable,
//   NestMiddleware,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class AuthMiddleware implements NestMiddleware {
//   constructor(private jwtService: JwtService) {}

//   async use(req: any, res: any, next: Function) {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       throw new UnauthorizedException('JWT키가 없지롱');
//     }

//     let token: string;
//     try {
//       token = authHeader.split(' ')[1];
//       const payload = await this.jwtService.verify(token);
//       req.user = payload;
//       next();
//     } catch (err) {
//       throw new UnauthorizedException(`JWT 만료 됐지롱: ${token}`);
//     }
//   }
// }
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: any, res: any, next: Function) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = await this.jwtService.verify(token);

        res.locals.user = payload;
      } catch (err) {
        console.error(`JWT 만료 됐거나 유효하지 않음: ${token}`);
      }
    }

    next(); // 미들웨어 통과
  }
}
