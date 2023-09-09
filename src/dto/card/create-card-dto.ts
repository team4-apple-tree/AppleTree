import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export enum ToDoState {
  TODO = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
}
export class CreateCardDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  desc: string;

  @IsOptional()
  @IsEnum(ToDoState) // ToDoState enum을 사용하여 유효성 검사
  selectToDo: number | null;
}
