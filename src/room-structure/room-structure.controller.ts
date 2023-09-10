import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { RoomStructureService } from './room-structure.service';
import { RoomStructure } from '../entity/roomStructure.entity';
import { CreateRoomStructureDto } from '../dto/RoomStructure/create-room-structure.dto';

@Controller('room-structure')
export class RoomStructureController {
  constructor(private readonly roomStructureService: RoomStructureService) {}

  @Get()
  findAll(): Promise<RoomStructure[]> {
    return this.roomStructureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<RoomStructure> {
    return this.roomStructureService.findOne(id);
  }

  @Post(':roomId')
  async create(
    @Param('roomId') roomId: number,
    @Body() createRoomStructureDto: CreateRoomStructureDto,
  ): Promise<RoomStructure> {
    console.log('Request received:', roomId, createRoomStructureDto); // 요청 데이터 로깅
    return this.roomStructureService.create(roomId, createRoomStructureDto);
  }
}
