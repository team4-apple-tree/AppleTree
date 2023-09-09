import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = await request.user;

    if (!user) {
      return false;
    }

    // return roles.includes(user.role);
    if (!roles.includes(user.role)) {
      throw new ForbiddenException('권한이 존재하지 않습니다.');
    }

    return true;
  }
}
