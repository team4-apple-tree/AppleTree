import { IsEnum, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { SeatType } from 'src/entity/seat.entity';

export class UpdateSeatDto {
  @IsNumber()
  @IsOptional()
  readonly price?: number; // 가격을 선택적으로 수정

  @IsBoolean()
  @IsOptional()
  readonly reservationStatus?: boolean; // 예약 상태를 선택적으로 수정

  @IsEnum(SeatType)
  @IsOptional()
  readonly type?: SeatType; // 좌석 유형을 선택적으로 수정
}
