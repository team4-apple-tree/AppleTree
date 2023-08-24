import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { kindEnum } from 'src/entity/seat.entity';

export type Seat = [number, number];

export class updateSeatDto {

  @IsEnum(kindEnum)
  @IsNotEmpty()
  readonly kind: kindEnum;

  @IsNotEmpty()
  readonly price: number;

}

