import { IsNumber } from 'class-validator';

export class DeleteArticleDto {
  @IsNumber()
  readonly password: number;
}