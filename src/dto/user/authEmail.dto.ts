import { PartialType } from '@nestjs/mapped-types';
import { CheckEmailDto } from './checkEmail.dto';

export class AuthEmailDto extends PartialType(CheckEmailDto) {}
