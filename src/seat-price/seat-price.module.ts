import { Module } from '@nestjs/common';
import { SeatPriceService } from './seat-price.service';
import { SeatPrice } from 'src/entity/seatPrice.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatPriceController } from './seat-price.controller';
import { Seat } from 'src/entity/seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SeatPrice, Seat])],
  exports: [TypeOrmModule.forFeature([SeatPrice])],
  controllers: [SeatPriceController],
  providers: [SeatPriceService],
})
export class SeatPriceModule {}
