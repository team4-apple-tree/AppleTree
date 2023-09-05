import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entity/user.entity';
import { Board } from '../entity/board.entity';
import { Card } from '../entity/card.entity';
import { Comment } from '../entity/comment.entity';
import { Post } from '../entity/post.entity';
import { Room } from '../entity/room.entity';
import { Seat } from '../entity/seat.entity';
import { Todo } from '../entity/to-do.entity';
import { Point } from '../entity/point.entity';
import { Group } from '../entity/group.entity';
import { Payment } from '../entity/payment.entity';

import { Member } from 'src/entity/member.entity';
import { Access } from 'src/entity/access.entity';
import { Stopwatch } from 'src/entity/stopwatch.entity';
import { Invitation } from 'src/entity/invite.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      entities: [
        User,
        Board,
        Comment,
        Member,
        Card,
        Post,
        Room,
        Seat,
        Todo,
        Point,
        Group,
        Access,
        Payment,
        Stopwatch,
        Invitation,
      ],
      synchronize: this.configService.get<boolean>('DATABASE_SYNCHRONIZE'),
    };
  }
}
