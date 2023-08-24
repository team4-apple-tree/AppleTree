import {  IsNotEmpty, IsEnum, IsArray, ArrayMinSize, ArrayMaxSize, ValidateNested } from 'class-validator';
import { kindEnum } from 'src/entity/seat.entity';
import { Type } from 'class-transformer';
// import { SeatDto } from './seat-dto'

export type Seat = [number, number, boolean];

export class createSeatDto {

  @IsEnum(kindEnum)
  @IsNotEmpty()
  readonly kind: kindEnum;

  @IsNotEmpty()
  readonly price: number;

  @IsNotEmpty() // row 속성이 필수인 경우, @IsNotEmpty() 데코레이터를 추가합니다.
  readonly row: number; // row 속성 추가

  @IsNotEmpty() // column 속성이 필수인 경우, @IsNotEmpty() 데코레이터를 추가합니다.
  readonly column: number; // column 속성 추가

  // @IsArray()
  // @ArrayMinSize(1, { message: '적어도 1개의 좌석이 필요합니다.' })
  // @ArrayMaxSize(100, { message: '좌석은 최대 100개까지 가능합니다.' })
  // @ValidateNested({ each: true })
  // @Type(() => SeatDto)
  // readonly seat: SeatDto[];
}
