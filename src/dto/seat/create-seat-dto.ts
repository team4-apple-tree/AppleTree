import { IsEnum, IsOptional, IsNumber } from 'class-validator';
import { SeatType } from 'src/entity/seat.entity';

export class createSeatDto {
  @IsNumber()
  readonly row: number;

  @IsNumber()
  readonly column: number;

  @IsNumber()
  @IsOptional()
  readonly price: number | null;

  @IsNumber()
  readonly roomId: number;

  @IsEnum(SeatType)
  @IsOptional()
  readonly type: SeatType | null;
}
