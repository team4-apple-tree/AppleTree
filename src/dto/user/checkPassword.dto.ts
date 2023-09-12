import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user-dto';

export class CheckPasswordDto extends PickType(CreateUserDto, ['password']) {}
