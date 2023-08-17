import { Module } from '@nestjs/common';
import { SeatController } from './seat.controller';
import { SeatService } from './seat.service';

@Module({
  controllers: [SeatController],
  providers: [SeatService]
})
export class SeatModule {}
