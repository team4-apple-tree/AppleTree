import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomStructure } from '../entity/roomStructure.entity';
import { CreateRoomStructureDto } from 'src/dto/RoomStructure/create-room-structure.dto';
import { SeatService } from '../seat/seat.service'; // SeatService를 import합니다.
import { createSeatDto } from 'src/dto/seat/create-seat-dto';

@Injectable()
export class RoomStructureService {
  constructor(
    @InjectRepository(RoomStructure)
    private roomStructureRepository: Repository<RoomStructure>,
    private readonly seatService: SeatService, // SeatService를 주입받습니다.
  ) {}

  async create(dto: CreateRoomStructureDto): Promise<RoomStructure> {
    const { rows, columns } = dto;
    const seatShape = Array(rows)
      .fill(0)
      .map(() => Array(columns).fill(0));

    const newRoomStructure = new RoomStructure();
    newRoomStructure.rows = rows;
    newRoomStructure.columns = columns;
    newRoomStructure.seatShape = JSON.stringify(seatShape);

    const savedRoomStructure = await this.roomStructureRepository.save(
      newRoomStructure,
    );

    const seatDtos: createSeatDto[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const seatDto = {
          type: 1,
          row: row,
          column: col,
          price: 10000,
          roomId: savedRoomStructure.id,
        };
        seatDtos.push(seatDto);
      }
    }

    await this.seatService.create(seatDtos);

    return savedRoomStructure;
  }

  async findAll(): Promise<RoomStructure[]> {
    return this.roomStructureRepository.find();
  }

  async findOne(id: number): Promise<RoomStructure> {
    return this.roomStructureRepository.findOne({ where: { id } });
  }
}
