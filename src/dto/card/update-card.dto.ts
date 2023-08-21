import { IsNotEmpty } from 'class-validator';

export class UpdateCardDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  desc: string;
}
