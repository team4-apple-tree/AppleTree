import { IsNumber, IsOptional, IsEnum } from 'class-validator';
import { seatEnum } from 'src/entity/seat.entity';
export class createSeatInfoDto {
  @IsEnum(seatEnum)
  @IsOptional()
  readonly type: seatEnum | null;

  @IsNumber()
  @IsOptional()
  readonly price: number | null;

  @IsNumber()
  @IsOptional()
  readonly seatId: number | null;
}
