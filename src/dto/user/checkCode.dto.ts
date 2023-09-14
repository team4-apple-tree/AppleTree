import { IsEmail, IsNumber } from 'class-validator';

export class CheckCodeDto {
  @IsEmail()
  readonly email: string;

  @IsNumber()
  readonly code: number;
}
