import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Room } from '../entity/room.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Room])
  ],
  controllers: [RoomController],
  providers: [RoomService]
})
export class RoomModule {}
