import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomStructure } from '../entity/roomStructure.entity';
import { CreateRoomStructureDto } from 'src/dto/RoomStructure/create-room-structure.dto';
import { SeatService } from '../seat/seat.service';
import { createSeatDto } from 'src/dto/seat/create-seat-dto';
import { Room } from '../entity/room.entity';

@Injectable()
export class RoomStructureService {
  constructor(
    @InjectRepository(RoomStructure)
    private roomStructureRepository: Repository<RoomStructure>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    private readonly seatService: SeatService,
  ) {}

  async create(
    roomId: number,
    dto: CreateRoomStructureDto,
  ): Promise<RoomStructure> {
    // Room 엔터티 조회
    const room = await this.roomRepository.findOne({ where: { roomId } });
    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found.`);
    }

    // 기존 RoomStructure 검사
    const existingStructure = await this.roomStructureRepository.findOne({
      where: { room: room },
    });
    if (existingStructure) {
      throw new ConflictException('This room already has a structure.');
    }

    const { rows, columns } = dto;
    const seatShape = Array(rows)
      .fill(0)
      .map(() => Array(columns).fill(0));

    const newRoomStructure = new RoomStructure();
    newRoomStructure.rows = rows;
    newRoomStructure.columns = columns;
    newRoomStructure.seatShape = JSON.stringify(seatShape);
    newRoomStructure.room = room;

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
          roomId: roomId,
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
