import { Injectable } from '@nestjs/common';
import { SeatPrice } from 'src/entity/seatPrice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seat } from '../entity/seat.entity';
import { createSeatInfoDto } from 'src/dto/seat-price/createSeatPrice.dto';
import { type } from 'os';

@Injectable()
export class SeatPriceService {
  constructor(
    @InjectRepository(SeatPrice)
    private seatPriceRepository: Repository<SeatPrice>,
    @InjectRepository(Seat) private seatRepository: Repository<Seat>,
  ) {}

  async createPrice(seatId: number, data: createSeatInfoDto) {
    const seat = await this.seatRepository.findOne({
      where: { seatId },
      select: ['type'],
    });
    console.log(seat.type);
    const seatPrice = new SeatPrice();
    seatPrice.type = seat.type;
    seatPrice.price = data.price;
    seatPrice.seatId = seatId;

    await this.seatPriceRepository.save(seatPrice);
  }
}
