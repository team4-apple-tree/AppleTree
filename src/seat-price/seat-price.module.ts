import { Module } from '@nestjs/common';
import { SeatPriceService } from './seat-price.service';
import { SeatPrice } from 'src/entity/seatPrice.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatPriceController } from './seat-price.controller';
import { Seat } from 'src/entity/seat.entity';
import { RoomModule } from '../room/room.module'; // 적절한 경로로 수정해야 합니다.

@Module({
  imports: [
    TypeOrmModule.forFeature([SeatPrice, Seat]),
    RoomModule, // 이 부분을 추가합니다.
  ],
  exports: [TypeOrmModule.forFeature([SeatPrice])],
  controllers: [SeatPriceController],
  providers: [SeatPriceService],
})
export class SeatPriceModule {}
