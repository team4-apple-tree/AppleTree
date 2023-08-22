import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateArticleDto } from '../dto/board/create-article.dto';
import { DeleteArticleDto } from '../dto/board/delete-article.dto';
import { UpdateArticleDto } from '../dto/board/update-article.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('/articles')
  getArticles() {
    return this.boardService.getArticles();
  }

  // @Get('/articles/:id')
  // getArticleById(@Param('id') articleId: number) {
  //   return this.boardService.getArticleById(articleId);
  // }

  @Post('/articles')
  createArticle(@Body() data: CreateArticleDto) {
    return this.boardService.createArticle(
      data.title,
      data.content,
      data.password,
    );
  }

  // @Put('/articles/:id')
  // updateArticle(
  //   @Param('id') articleId: number,
  //   @Body() data: UpdateArticleDto,
  // ) {
  //   return this.boardService.updateArticle(
  //     articleId,
  //     data.title,
  //     data.content,
  //     data.password,
  //   );
  // }

  @Delete('/articles/:id')
  deleteArticle(
    @Param('id') articleId: number,
    @Body() data: DeleteArticleDto,
  ) {
    return this.boardService.deleteArticle(articleId, data.password);
  }
}
