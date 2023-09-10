import { Module } from '@nestjs/common';
import { RoomStructureService } from './room-structure.service';
import { RoomStructureController } from './room-structure.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomStructure } from '../entity/roomStructure.entity';
import { Room } from '../entity/room.entity'; // Room 엔터티를 임포트합니다.
import { SeatModule } from 'src/seat/seat.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room, RoomStructure]), SeatModule],
  providers: [RoomStructureService],
  controllers: [RoomStructureController],
})
export class RoomStructureModule {}
