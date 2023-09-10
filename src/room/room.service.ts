import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entity/room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  // 새로운 Room 생성
  async create(createRoomData: Partial<Room>): Promise<Room> {
    const newRoom = this.roomRepository.create(createRoomData);
    return this.roomRepository.save(newRoom);
  }

  // 모든 Room 조회
  async findAll(): Promise<Room[]> {
    return await this.roomRepository.find();
  }

  // 특정 ID를 가진 Room 조회
  async findOne(roomId: number): Promise<Room> {
    const foundRoom = await this.roomRepository.findOne({
      where: { roomId },
    });
    if (!foundRoom) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }
    return foundRoom;
  }

  // 특정 ID를 가진 Room의 정보 수정
  async update(roomId: number, updateRoomData: Partial<Room>): Promise<Room> {
    await this.findOne(roomId); // Room의 존재를 확인
    await this.roomRepository.update(roomId, updateRoomData);
    return this.findOne(roomId);
  }

  // 특정 ID를 가진 Room 삭제
  async remove(roomId: number): Promise<void> {
    const room = await this.findOne(roomId); // Room의 존재를 확인
    await this.roomRepository.remove(room);
  }
}
