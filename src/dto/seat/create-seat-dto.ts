import { IsEnum, IsOptional, IsNumber } from 'class-validator';
import { seatEnum } from 'src/entity/seat.entity';

export class createSeatDto {
  @IsNumber()
  readonly row: number;

  @IsNumber()
  readonly column: number;

  @IsNumber()
  readonly price: number;

  @IsNumber()
  readonly roomId: number;

  @IsEnum(seatEnum)
  @IsOptional()
  readonly type: seatEnum | null;
}
