import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  Delete,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from '../entity/room.entity';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async create(@Body() createRoomDto: any): Promise<Room> {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  async findAll(): Promise<Room[]> {
    return this.roomService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Room> {
    if (isNaN(id)) {
      throw new BadRequestException('Invalid ID provided');
    }
    return this.roomService.findOne(id);
  }

  @Get(':roomId/image')
  async getRoomImage(@Param('roomId') roomId: number) {
    const room = await this.roomService.findOne(roomId);
    const imageName = room.image;

    const baseURL = 'http://localhost:4444/images/';
    const imageURL = imageName.startsWith('http')
      ? imageName
      : `${baseURL}${imageName}`;

    return { path: imageURL };
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateRoomDto: any,
  ): Promise<Room> {
    return this.roomService.update(id, updateRoomDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.roomService.remove(id);
  }
}
