import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Room, typeEnum } from 'src/entity/room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private roomRepository: Repository<Room>,
  ) {}

  async createRoom(name: string, address: string, type: typeEnum) {
    const room = await this.roomRepository.findOne({
      where: { name, address, deletedAt: null },
      select: ['name'],
    });
    if (room) {
      throw new ConflictException('해당하는 룸이 이미 있지롱');
    }
    const newRoom = this.roomRepository.create({
      name: name,
      address: address,
      type: type,
    });

    return await this.roomRepository.save(newRoom);
  }

  async updateRoom(
    roomId: number,
    name: string,
    address: string,
    type: typeEnum,
  ) {
    const room = this.roomRepository.create({
      roomId,
      name,
      address,
      type,
    });
    await this.roomRepository.save(room);
  }

  async deleteRoom(roomId: number) {
    await this.roomRepository.softDelete(roomId);
  }

  async getRoom() {
    return this.roomRepository.find({ where: { deletedAt: null } });
  }
}
