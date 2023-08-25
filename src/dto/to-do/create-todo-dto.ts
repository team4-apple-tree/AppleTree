import { IsNotEmpty } from 'class-validator';

export class CreateToDoDto {
  @IsNotEmpty()
  state: number;
}
