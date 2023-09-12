import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entity/user.entity';
import { Card } from '../entity/card.entity';
import { Room } from '../entity/room.entity';
import { Seat } from '../entity/seat.entity';
import { Point } from '../entity/point.entity';
import { Group } from '../entity/group.entity';
import { Payment } from '../entity/payment.entity';
import { RoomStructure } from '../entity/roomStructure.entity';
import { Member } from 'src/entity/member.entity';
import { SeatPrice } from 'src/entity/seatPrice.entity';
import { TimeTable } from 'src/entity/timeTable.entity';
import { Reservation } from 'src/entity/reservation.entity';

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
        Member,
        Card,
        Room,
        Seat,
        Point,
        Group,
        Payment,
        RoomStructure,
        SeatPrice,
        TimeTable,
        Reservation,
      ],
      synchronize: this.configService.get<boolean>('DATABASE_SYNCHRONIZE'),
    };
  }
}
