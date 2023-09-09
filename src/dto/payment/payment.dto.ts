import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class PaymentDto {
  @IsNotEmpty()
  @IsNumber()
  points: number;

  @IsNotEmpty()
  @IsDate()
  paymentTime: Date;
}
