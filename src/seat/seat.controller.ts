import { Post, Body, Param, Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { SeatService } from './seat.service';
import { createSeatDto } from '../dto/seat/create-seat-dto';
import { Seat } from '../entity/seat.entity';
@Controller('seat')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Post('/new')
  async createSeat(
    @Body() seatData: { type: number; row: number; column: number },
  ) {
    const { type, row, column } = seatData;
    await this.seatService.createSeat(type, row, column);
    return { message: '좌석 생성이 완료되었습니다.', seatData };
  }

  @Post('/:roomId')
  async create(
    @Param('roomId') roomId: number,
    @Body() data: { seat: createSeatDto[] },
  ) {
    const seats = data.seat;
    return await this.seatService.create(seats, roomId);
  }

  @Get('/:roomId')
  async seatInfo(@Param('roomId') roomId: number) {
    return await this.seatService.seatInfo(roomId);
  }
}
