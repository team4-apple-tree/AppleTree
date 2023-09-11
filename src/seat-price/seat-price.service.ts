import { Injectable } from '@nestjs/common';
import { SeatPrice } from 'src/entity/seatPrice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { SeatType, Seat } from '../entity/seat.entity';
import { createSeatInfoDto } from 'src/dto/seat-price/createSeatPrice.dto';
import { Room } from 'src/entity/room.entity';
@Injectable()
export class SeatPriceService {
  constructor(
    @InjectRepository(SeatPrice)
    private seatPriceRepository: Repository<SeatPrice>,
    @InjectRepository(Room) // Room repository를 inject합니다.
    private roomRepository: Repository<Room>,
    @InjectRepository(Seat) // Seat의 Repository를 주입합니다.
    private seatRepository: Repository<Seat>,
  ) {}

  async createPriceByType(
    roomId: number, // roomId를 추가로 받습니다.
    seatTypeString: string,
    data: createSeatInfoDto,
  ): Promise<void> {
    console.log('Received seatType:', seatTypeString);

    const seatType = parseInt(seatTypeString, 10);
    if (isNaN(seatType)) {
      throw new Error('Seat type is not a valid number.');
    }

    let type: SeatType;

    switch (seatType) {
      case 1:
        type = SeatType.일인석;
        break;
      case 2:
        type = SeatType.사인석;
        break;
      case 3:
        type = SeatType.회의실;
        break;
      default:
        throw new Error('Invalid seat type provided.');
    }

    const room = await this.roomRepository.findOne({ where: { roomId } });
    if (!room) {
      throw new Error('Invalid room ID provided.');
    }

    const existingPrice = await this.seatPriceRepository.findOne({
      where: { type, room: room as FindOptionsWhere<Room> },
    });

    if (existingPrice) {
      existingPrice.price = data.price;
      await this.seatPriceRepository.save(existingPrice);
    } else {
      const newSeatPrice = new SeatPrice();
      newSeatPrice.type = type;
      newSeatPrice.price = data.price;
      newSeatPrice.room = room; // room을 할당합니다.
      await this.seatPriceRepository.save(newSeatPrice);
    }
    console.log(roomId);
    const seatsToUpdate = await this.seatRepository.find({
      where: { room: { roomId: roomId }, type: seatType },
    });

    for (const seat of seatsToUpdate) {
      seat.price = data.price;
      await this.seatRepository.save(seat);
    }
  }

  async getPriceByType(
    roomId: number,
    seatTypeString: string,
  ): Promise<SeatPrice> {
    const seatType = parseInt(seatTypeString, 10);
    if (isNaN(seatType)) {
      throw new Error('Seat type is not a valid number.');
    }

    const room = await this.roomRepository.findOne({
      where: { roomId: roomId },
    });
    if (!room) {
      throw new Error('Invalid room ID provided.');
    }

    const seatPrice = await this.seatPriceRepository.findOne({
      where: { type: seatType, room: { roomId } },
    });
    console.log('seatPrice', seatPrice);
    console.log('room', room);

    // console.log('Checking values:', seatType, room);
    if (!seatPrice) {
      throw new Error(
        `Seat price for room ID ${roomId} and seat type ${seatType} not found.`,
      );
    }

    return seatPrice;
  }

  async updatePriceByType(
    roomId: number,
    seatTypeString: string,
    data: createSeatInfoDto,
  ): Promise<void> {
    const seatType = parseInt(seatTypeString, 10);
    if (isNaN(seatType)) {
      throw new Error('Seat type is not a valid number.');
    }

    const room = await this.roomRepository.findOne({ where: { roomId } });
    if (!room) {
      throw new Error('Invalid room ID provided.');
    }

    const existingSeatPrice = await this.seatPriceRepository.findOne({
      where: { type: seatType, room: { roomId } },
    });
    const seatsToUpdate = await this.seatRepository.find({
      where: { room: { roomId: roomId }, type: seatType },
    });

    for (const seat of seatsToUpdate) {
      seat.price = data.price;
      await this.seatRepository.save(seat);
    }

    if (!existingSeatPrice) {
      throw new Error('Seat price for given room and seat type not found.');
    }

    existingSeatPrice.price = data.price;
    await this.seatPriceRepository.save(existingSeatPrice);
  }
}
