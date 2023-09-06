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

  @Post('/:roomId')
  create(@Param('roomId') roomId: number, @Body() data: createSeatDto[]) {
    return this.seatService.create(data);
  }

  @Patch('/:seatId')
  updateSeatInfo(
    @Param('seatId') seatId: number,
    @Body() seatData: UpdateSeatDto,
  ) {
    return this.seatService.updateSeat(seatId, seatData);
  }

  @Get('/:roomId')
  async seatInfo(@Param('roomId') roomId: number) {
    const seatDetail = await this.seatService.seatInfo(roomId);
    if (!seatDetail) {
      throw new NotFoundException('해당 방의 좌석 정보가 없습니다.');
    }
    return seatDetail;
  }
}
