import { IsNotEmpty } from 'class-validator';

export class UpdateToDoDto {
  @IsNotEmpty()
  state: number;
}
