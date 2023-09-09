import { PickType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create-article.dto';

export class DeleteArticleDto extends PickType(CreateArticleDto, [
  'password',
] as const) {}