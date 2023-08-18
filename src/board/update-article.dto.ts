import { IsNumber, IsString } from 'class-validator';

export class UpdateArticleDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;

  @IsNumber()
  readonly password: number;
}