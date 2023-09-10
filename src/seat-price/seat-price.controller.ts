import { Controller, Put } from '@nestjs/common';
import { SeatPriceService } from './seat-price.service';
import { Post, Body, Param, Get } from '@nestjs/common';
import { createSeatInfoDto } from 'src/dto/seat-price/createSeatPrice.dto';

@Controller('seat-price')
export class SeatPriceController {
  constructor(private readonly seatPriceService: SeatPriceService) {}

  @Post('/room/:roomId/type/:seatType')
  async createPriceByType(
    @Param('roomId') roomId: number, // roomId를 추가로 받습니다.
    @Param('seatType') seatType: string,
    @Body() data: createSeatInfoDto,
  ) {
    console.log(
      'In Controller, Received roomId:',
      roomId,
      'seatType:',
      seatType,
    ); // Controller에서의 로그 추가
    return await this.seatPriceService.createPriceByType(
      roomId,
      seatType,
      data,
    ); // roomId를 service로 전달합니다.
  }
  @Get('/room/:roomId/type/:seatType')
  async getPriceByType(
    @Param('roomId') roomId: number,
    @Param('seatType') seatType: string,
  ) {
    return await this.seatPriceService.getPriceByType(roomId, seatType);
  }

  @Put('/room/:roomId/type/:seatType')
  async updatePriceByType(
    @Param('roomId') roomId: number,
    @Param('seatType') seatType: string,

    @Body() data: createSeatInfoDto,
  ) {
    console.log('roomId', roomId);
    console.log('seatType', seatType);
    return await this.seatPriceService.updatePriceByType(
      roomId,
      seatType,
      data,
    );
  }
}
