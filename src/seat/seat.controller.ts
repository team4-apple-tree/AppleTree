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

  @Post(':roomId') // 변경된 부분: ':'을 추가하여 파라미터를 roomId로 설정
  async create(@Param('roomId') roomId: number, @Body() data: createSeatDto[]) {
    await this.seatService.createSeatsForRoomStructure(roomId, data);
    return { message: '좌석 생성이 완료되었습니다.' };
  }

  @Get('room/:roomId') // 변경된 부분: 'room' 추가
  async seatInfo(@Param('roomId') roomId: number) {
    const seatDetail = await this.seatService.seatInfo(roomId);
    if (!seatDetail) {
      throw new NotFoundException('해당 방의 좌석 정보가 없습니다.');
    }
    return seatDetail;
  }

  @Get(':seatId') // 변경된 부분: ':'을 추가하여 파라미터를 seatId로 설정
  async getSeatById(@Param('seatId') seatId: number) {
    const seat = await this.seatService.getSeatById(seatId);
    if (!seat) {
      throw new NotFoundException('해당 좌석 정보가 없습니다.');
    }
    return seat;
  }

  @Patch(':seatId') // 변경된 부분: ':'을 추가하여 파라미터를 seatId로 설정
  async updateSeatInfo(
    @Param('seatId') seatId: number,
    @Body() seatData: UpdateSeatDto,
  ) {
    await this.seatService.updateSeat(seatId, seatData);
    return { message: '좌석 정보가 업데이트되었습니다.' };
  }
}
