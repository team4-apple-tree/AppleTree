import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomStructureService } from './room-structure.service';
import { RoomStructureController } from './room-structure.controller';
import { RoomStructure } from '../entity/roomStructure.entity';
import { SeatModule } from '../seat/seat.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoomStructure]), SeatModule],
  providers: [RoomStructureService],
  controllers: [RoomStructureController],
})
export class RoomStructureModule {}
