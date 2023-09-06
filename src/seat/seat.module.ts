import { Module } from '@nestjs/common';
import { SeatController } from './seat.controller';
import { SeatService } from './seat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from 'src/entity/seat.entity';
import { RoomModule } from 'src/room/room.module';
import { SeatPriceModule } from 'src/seat-price/seat-price.module';

@Module({
  imports: [TypeOrmModule.forFeature([Seat]), RoomModule, SeatPriceModule],
  controllers: [SeatController],
  providers: [SeatService],
})
export class SeatModule {}
