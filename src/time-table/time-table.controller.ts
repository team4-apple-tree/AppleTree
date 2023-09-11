import { Controller, Get, Req } from '@nestjs/common';
import { TimeTableService } from './time-table.service';
import { Post, Body, Param, UseGuards } from '@nestjs/common';
import { timeTableDto } from 'src/dto/time-table/createTimeTable.dto';
import { JwtAuthGuard } from 'src/user/jwt.guard';
import { TimeTable } from 'src/entity/timeTable.entity';

@Controller('time-table')
export class TimeTableController {
  constructor(private readonly timeTableService: TimeTableService) {}

  @Post('/create/:roomId')
  async createTimetableForSeat(
    @Body() data: timeTableDto,
    @Param('roomId') roomId: number,
  ): Promise<void> {
    await this.timeTableService.createTimetableForSeat(data, roomId);
  }

  @Post('/reservation')
  @UseGuards(JwtAuthGuard)
  async makeReservation(
    @Req() req: any,
    @Body() requestBody: { seatIds: number[]; timeTableIds: number[] },
  ): Promise<void> {
    const user = await req.user;
    const userId = user.id;
    console.log(req.user);
    const { timeTableIds, seatIds } = requestBody;
    await this.timeTableService.makeReservation(timeTableIds, seatIds, userId);
  }

  // 해당 룸의 타임테이블 조회
  @Get(':roomId')
  async findTimeTablesByRoomId(
    @Param('roomId') roomId: number,
  ): Promise<TimeTable[]> {
    return await this.timeTableService.findTimeTablesByRoomId(roomId);
  }
}
