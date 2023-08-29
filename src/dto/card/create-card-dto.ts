import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ToDoState } from 'src/entity/card.entity';

export class CreateCardDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  desc: string;
}
