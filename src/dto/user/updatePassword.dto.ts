import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user-dto';

export class UpdatePasswordDto extends PickType(CreateUserDto, [
  'password',
  'confirm',
]) {}
