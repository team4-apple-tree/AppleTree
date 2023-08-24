import {
    Controller,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Get
  } from '@nestjs/common';
  import { RoomService } from './room.service';
  import * as cookieParser from 'cookie-parser';
  import { Request, Response } from 'express';
import { CreateRoomDto } from 'src/dto/room/create-room-dto';
import { UpdateRoomDto } from 'src/dto/room/update-room-dto'

@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService){}

    @Post('/')
    async createRoom(@Body() data: CreateRoomDto){
        return await this.roomService.createRoom(
            data.name,
            data.address,
            data.type
        )
    }

    @Put('/:roomId')
    async update(@Param('roomId') roomId:number, @Body() data:UpdateRoomDto){
        return this.roomService.updateRoom(roomId, data.name, data.address, data.type)
    }

    @Delete('/:roomId')
    async delete(@Param('roomId') roomId:number){
        return this.roomService.deleteRoom(roomId)
    }

    @Get('/')
    async getRoom(){
        return this.roomService.getRoom()
    }
}
