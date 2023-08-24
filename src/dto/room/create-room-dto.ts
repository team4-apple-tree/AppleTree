  import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
  import { typeEnum } from 'src/entity/room.entity';

  export class CreateRoomDto{
    @IsNotEmpty()
    readonly name : string

    @IsNotEmpty()
    readonly address : string

    @IsEnum(typeEnum)
    @IsNotEmpty()
    @IsOptional()
    readonly type : typeEnum | null
    state : typeEnum
  }
