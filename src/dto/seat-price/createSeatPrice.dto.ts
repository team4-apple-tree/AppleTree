import { IsNumber, IsOptional, IsEnum } from 'class-validator';
import { SeatType } from 'src/entity/seat.entity';
export class createSeatInfoDto {
  @IsEnum(SeatType)
  @IsOptional()
  readonly type: SeatType | null;

  @IsNumber()
  @IsOptional()
  readonly price: number | null;

  @IsNumber()
  @IsOptional()
  readonly seatId: number | null;
}
