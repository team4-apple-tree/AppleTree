import { IsNotEmpty, IsEnum } from 'class-validator';

export enum ToDoState {
  TODO = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
}
export class UpdateCardDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  desc: string;

  @IsEnum(ToDoState)
  selectToDo: number;
}
