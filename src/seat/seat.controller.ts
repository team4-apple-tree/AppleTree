import {
  Post,
  Body,
  Param,
  Get,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { SeatService } from './seat.service';
import { createSeatDto } from '../dto/seat/create-seat-dto';
import { UpdateSeatDto } from '../dto/seat/update-seat-dto';

@Controller('seat')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Post(':roomId')
  async create(@Param('roomId') roomId: number, @Body() data: createSeatDto[]) {
    await this.seatService.createSeatsForRoomStructure(roomId, data);
    return { message: '좌석 생성이 완료되었습니다.' };
  }

  @Get('room/:roomId')
  async seatInfo(@Param('roomId') roomId: number) {
    const seatDetail = await this.seatService.seatInfo(roomId);
    if (!seatDetail) {
      throw new NotFoundException('해당 방의 좌석 정보가 없습니다.');
    }
    return seatDetail;
  }

  @Get(':seatId')
  async getSeatById(@Param('seatId') seatId: number) {
    const seat = await this.seatService.getSeatById(seatId);
    if (!seat) {
      throw new NotFoundException('해당 좌석 정보가 없습니다.');
    }
    return seat;
  }

  @Patch(':seatId')
  async updateSeatInfo(
    @Param('seatId') seatId: number,
    @Body() seatData: UpdateSeatDto,
  ) {
    await this.seatService.updateSeat(seatId, seatData);
    return { message: '좌석 정보가 업데이트되었습니다.' };
  }
}
