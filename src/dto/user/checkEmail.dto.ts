import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user-dto';

export class CheckEmailDto extends PickType(CreateUserDto, ['email']) {}
