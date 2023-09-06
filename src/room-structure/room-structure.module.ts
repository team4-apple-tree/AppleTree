import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomStructureService } from './room-structure.service';
import { RoomStructureController } from './room-structure.controller';
import { RoomStructure } from '../entity/roomStructure.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomStructure])],
  providers: [RoomStructureService],
  controllers: [RoomStructureController],
})
export class RoomStructureModule {}
