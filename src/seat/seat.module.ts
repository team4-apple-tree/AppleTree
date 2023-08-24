import { Module } from '@nestjs/common';
import { SeatController } from './seat.controller';
import { SeatService } from './seat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seats } from '../entity/seat.entity'
import { RoomModule } from 'src/room/room.module';
import { Room } from '../entity/room.entity'
@Module({
  imports :[
    TypeOrmModule.forFeature([Seats,Room]),
    RoomModule
  ],
  controllers: [SeatController],
  providers: [SeatService]
})
export class SeatModule {}
