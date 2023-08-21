import { IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  readonly comment: string;
}
