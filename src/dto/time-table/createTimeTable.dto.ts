import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class timeTableDto {
  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsBoolean()
  @IsOptional()
  isAvailable: boolean | null;
}