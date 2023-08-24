import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class SeatDto {
  low: number;
  column: number;
  isInsideCircle: boolean;
}
