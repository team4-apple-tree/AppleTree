import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomStructure } from '../entity/roomStructure.entity';
import { CreateRoomStructureDto } from 'src/dto/RoomStructure/create-room-structure.dto';

@Injectable()
export class RoomStructureService {
  constructor(
    @InjectRepository(RoomStructure)
    private roomStructureRepository: Repository<RoomStructure>,
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

    return await this.roomStructureRepository.save(newRoomStructure);
  }

  async findAll(): Promise<RoomStructure[]> {
    return this.roomStructureRepository.find();
  }

  async findOne(id: number): Promise<RoomStructure> {
    return this.roomStructureRepository.findOne({ where: { id } });
  }
}
