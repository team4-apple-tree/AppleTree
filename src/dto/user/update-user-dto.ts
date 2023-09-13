import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user-dto';
import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { roleEnum } from 'src/entity/user.entity';

export class UpdateUserDto extends PickType(CreateUserDto, ['name', 'desc']) {
  @IsString()
  @IsOptional()
  profileImage: string;
}
