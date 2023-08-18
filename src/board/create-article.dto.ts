import { IsNumber, IsString } from 'class-validator';

// 게시물 생성
export class CreateArticleDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;

  @IsNumber()
  readonly password: number;
}