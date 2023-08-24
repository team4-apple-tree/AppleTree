import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Req,
  Res,
  Patch,
  Param,
} from '@nestjs/common';
import { SeatService } from './seat.service';
import { createSeatDto } from '../dto/seat/create-seat-dto';
import { updateSeatDto } from '../dto/seat/update-seat-dto';

@Controller('seat')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Post('/:roomId')
  // async createSeat(@Param('roomId') roomId:number, @Body() data : createSeatDto, Seat:[][]){
  async createSeat(
    @Param('roomId') roomId: number,
    @Body() data: createSeatDto,
  ) {
    return this.seatService.createSeat(roomId, data);
    // return this.seatService.createSeat(roomId, data.type, data.price, data.seat as Seat[][])
  }

  // @Put('/seatId')
  // async updateSeat(@Param('seatId') seatId:number, @Body() data : updateSeatDto){
  //     return this.seatService.updateSeat(seatId, data.kind, data.price)
  // }
  @Put(':seatId')
  async updateSeat(
    @Param('seatId') seatId: number,
    @Body() data: updateSeatDto,
  ) {
    const result = await this.seatService.updateSeat(seatId, data.kind, data.price);
  }

  @Delete('/seatId')
  async deleteSeat(@Param('roomId') seatId: number) {
    return this.seatService.deleteSeat(seatId);
  }
}
