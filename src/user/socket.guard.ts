import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { UserService } from './user.service';

@Injectable()
export class SocketGuard {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async validateToken(token: string): Promise<any> {
    try {
      const secretKey = this.configService.get<string>('JWT_SECRET_KEY');

      const [authType, authToken] = token.split(' ');

      const userId = this.jwtService.verify(authToken, {
        secret: secretKey,
      }).id;

      const user = await this.userService.findById(userId);

      return user;
    } catch (error) {
      throw new Error('JWT 검증 실패');
    }
  }

  // canActivate(context: ExecutionContext): boolean | Promise<boolean> {
  //   console.log('aaa');
  //   const client = context.switchToWs().getClient();
  //   const token = client.handshake.query.token;

  //   try {

  //     const decoded = this.jwtService.verify(token, {secret: secretKey});

  //     client.user = decoded;

  //     return true;
  //   } catch (error) {
  //     return false;
  //   }
  // }
}
