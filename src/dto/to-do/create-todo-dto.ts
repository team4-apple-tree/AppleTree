import { IsNotEmpty, IsEnum } from 'class-validator';
import { ToDoState } from 'src/entity/to-do.entity';

export class CreateToDoDto {
  @IsNotEmpty()
  @IsEnum(ToDoState)
  state: ToDoState;
}
