import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Seat } from 'src/entity/seat.entity';
import { Room } from '../entity/room.entity';
import { UpdateSeatDto } from '../dto/seat/update-seat-dto';
import { SeatPrice } from '../entity/seatPrice.entity';
import { createSeatDto } from 'src/dto/seat/create-seat-dto';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat) private seatRepository: Repository<Seat>,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(SeatPrice)
    private seatPriceRepository: Repository<SeatPrice>,
  ) {}

  async create(seats: createSeatDto[]): Promise<void> {
    try {
      for (const seatDto of seats) {
        const seat = new Seat();
        seat.row = seatDto.row;
        seat.column = seatDto.column;
        seat.roomId = seatDto.roomId;
        seat.price = seatDto.price;
        seat.type = seatDto.type || 1;
        await this.seatRepository.save(seat);
      }
      console.log('좌석정보생성 완료');
    } catch (error) {
      console.error('MySQL로 좌석 생성 중 에러', error);
    }
  }

  async seatInfo(roomId: number) {
    const seats = await this.seatRepository.find({ where: { roomId } });

    const seatIds = seats.map((seat) => seat.seatId);
    const seatPrices = await this.seatPriceRepository.find({
      where: { seatId: In(seatIds) },
      select: ['price', 'type', 'seatId'],
    });

    const seatPriceMap = new Map<string, number>();
    for (const seatPrice of seatPrices) {
      seatPriceMap.set(seatPrice.type.toString(), seatPrice.price);
    }

    const promises = seats.map(async (seat) => {
      const price = seatPriceMap.get(seat.type.toString());
      if (price !== undefined) {
        seat.prices = price;
      } else {
        seat.prices = 0;
      }
    });

    await Promise.all(promises);
    return { seats };
  }

  async updateSeat(seatId: number, seatData: UpdateSeatDto): Promise<any> {
    const seat = await this.seatRepository.findOne({
      where: { seatId: seatId },
    });

    if (!seat) {
      throw new NotFoundException('좌석 정보가 없습니다.');
    }

    if (seatData.price) {
      seat.price = seatData.price;
    }

    if (seatData.reservationStatus !== undefined) {
      seat.reservationStatus = seatData.reservationStatus;
    }

    if (seatData.type) {
      seat.type = seatData.type;
    }
    return await this.seatRepository.save(seat);
  }

  async getSeatById(seatId: number): Promise<any> {
    const seat = await this.seatRepository.findOne({ where: { seatId } });

    if (!seat) {
      throw new NotFoundException(`Seat with ID ${seatId} not found.`);
    }

    return seat;
  }
}
