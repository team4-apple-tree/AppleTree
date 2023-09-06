import { IsInt, Min, Max } from 'class-validator';

export class CreateRoomStructureDto {
  @IsInt()
  @Min(1)
  @Max(100) // 최대 100으로 설정
  rows: number;

  @IsInt()
  @Min(1)
  @Max(100)
  columns: number;
}
