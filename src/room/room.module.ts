import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../entity/room.entity';
import { S3Service } from 'src/aws.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  exports: [TypeOrmModule.forFeature([Room])],
  controllers: [RoomController],
  providers: [RoomService, S3Service],
})
export class RoomModule {}
