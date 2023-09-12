import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  Delete,
  Post,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from '../entity/room.entity';
import { CreateRoomDto } from 'src/dto/room/create-room-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/aws.service';

@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createRoomDto: Omit<CreateRoomDto, 'image'>,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Room> {
    const folderName = 'room-image';
    const originalName = file.originalname;
    const fileName = `${Date.now()}_${Buffer.from(
      originalName,
      'latin1',
    ).toString('utf8')}`;

    const image = await this.s3Service.uploadImageToS3(
      file,
      folderName,
      fileName,
    );

    return this.roomService.create(createRoomDto, image);
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

  // @Get(':roomId/image')
  // async getRoomImage(@Param('roomId') roomId: number) {
  //   const room = await this.roomService.findOne(roomId);
  //   const imageName = room.image;

  //   const baseURL = 'http://localhost:4444/images/';
  //   const imageURL = imageName.startsWith('http')
  //     ? imageName
  //     : `${baseURL}${imageName}`;

  //   return { path: imageURL };
  // }

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
