import {
    Matches,
    IsString,
    IsEmail,
    MinLength,
    MaxLength,
    IsEnum,
    IsOptional
  } from 'class-validator';
  import { roleEnum } from 'src/entity/user.entity';

  export class DeleteRoomDto{}