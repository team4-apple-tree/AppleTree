import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization) {
      return false;
    }

    const [authType, authToken] = authorization.split(' ');

    if (!authToken) {
      return false;
    }

    const secretKey = this.configService.get<string>('JWT_SECRET_KEY');
    const userId = this.extractUserIdFromToken(authToken, secretKey);

    if (!userId) {
      return false;
      // throw new
    }

    const user = this.userService.findById(userId);

    if (!user) {
      return false;
    }

    request.user = user;

    return true;
  }

  private extractUserIdFromToken(
    token: string,
    secretKey: string,
  ): number | null {
    try {
      const payload: any = jwt.verify(token, secretKey);

      const userId = payload.id;

      return userId;
    } catch (error) {
      console.log(error.name);
      return null;
    }
  }
}
