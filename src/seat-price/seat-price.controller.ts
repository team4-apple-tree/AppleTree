import { Controller } from '@nestjs/common';
import { SeatPriceService } from './seat-price.service';
import { Post, Body, Param, Get } from '@nestjs/common';
import { createSeatInfoDto } from 'src/dto/seat-price/createSeatPrice.dto';

@Controller('seat-price')
export class SeatPriceController {
  constructor(private readonly seatPriceService: SeatPriceService) {}

  @Post('/:seatId')
  async createPrice(
    @Param('seatId') seatId: number,
    @Body() data: createSeatInfoDto,
  ) {
    return await this.seatPriceService.createPrice(seatId, data);
  }
}
