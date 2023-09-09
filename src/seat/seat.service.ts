import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Seat } from 'src/entity/seat.entity';
import { UpdateSeatDto } from '../dto/seat/update-seat-dto';
import { SeatPrice } from '../entity/seatPrice.entity';
import { createSeatDto } from 'src/dto/seat/create-seat-dto';
import { Room } from '../entity/room.entity';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat) private seatRepository: Repository<Seat>,
    @InjectRepository(SeatPrice)
    private seatPriceRepository: Repository<SeatPrice>,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
  ) {}

  async create(seatDtos: createSeatDto[]): Promise<void> {
    try {
      for (const seatDto of seatDtos) {
        const room = await this.roomRepository.findOne({
          where: { roomId: seatDto.roomId },
        });
        if (!room) {
          throw new NotFoundException(
            `Room with ID ${seatDto.roomId} not found.`,
          );
        }

        const seatPrice = await this.seatPriceRepository.findOne({
          where: { type: seatDto.type },
        });

        const seat = new Seat();
        seat.type = seatDto.type;
        seat.row = seatDto.row;
        seat.column = seatDto.column;
        seat.room = room;
        seat.reservationStatus = false;

        await this.seatRepository.save(seat);
      }
    } catch (error) {
      console.error('MySQL로 좌석 생성 중 에러', error);
      throw new Error('Failed to create seats.');
    }
  }

  async createSeatsForRoomStructure(
    roomId: number,
    seatsInfo: createSeatDto[],
  ): Promise<void> {
    try {
      const room = await this.roomRepository.findOne({ where: { roomId } }); // roomId를 사용하여 Room 객체를 조회합니다.
      if (!room) {
        throw new NotFoundException(`Room with ID ${roomId} not found.`);
      }

      for (const seatInfo of seatsInfo) {
        const seatPrice = await this.seatPriceRepository.findOne({
          where: { type: seatInfo.type },
        });

        const seat = new Seat();
        seat.type = seatInfo.type;
        seat.room = room; // 조회된 Room 객체를 할당합니다.
        seat.reservationStatus = false; // default status
        await this.seatRepository.save(seat);
      }
    } catch (error) {
      console.error('MySQL로 좌석 생성 중 에러', error);
    }
  }

  async seatInfo(roomId: number) {
    const seatsWithPrices = await this.seatRepository
      .createQueryBuilder('seat')
      .leftJoinAndSelect('seat.seatPrices', 'seatPrice')
      .where('seat.room = :roomId', { roomId })
      .getMany();

    return { seats: seatsWithPrices };
  }

  async updateSeat(seatId: number, seatData: UpdateSeatDto): Promise<any> {
    const seat = await this.seatRepository.findOne({ where: { seatId } });

    if (!seat) {
      throw new NotFoundException('좌석 정보가 없습니다.');
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
