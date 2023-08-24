import { PickType, } from '@nestjs/mapped-types';
import {
    IsString,
    IsEnum,
    IsNotEmpty, IsOptional
  } from 'class-validator';
  import { typeEnum } from 'src/entity/room.entity';
  import { CreateRoomDto } from './create-room-dto';

  export class UpdateRoomDto extends PickType(CreateRoomDto, [
    'name',
    'address',
    'type'
  ]){
    @IsString()
    readonly name : string

    @IsString()
    readonly address : string

    @IsEnum(typeEnum)
    @IsNotEmpty()
    @IsOptional()
    readonly type : typeEnum | null
    state : typeEnum
  }