import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
  } from '@nestjs/common';
  import { CommentService } from './comment.service';
  import { CreateCommentDto } from '../dto/comment/create-comment.dto';
  import { DeleteCommentDto } from '../dto/comment/delete-comment.dto';
  import { UpdateCommentDto } from '../dto/comment/update-comment.dto';
  
  @Controller('board')
  export class BoardController {
    constructor(private readonly CommentService: CommentService) {}
  
    @Get('/comments')
    getComments() {
      return this.CommentService.getComments();
    }
  
    @Get('/comments/:id')
    geCommentById(@Param('id') articleId: number) {
      return this.CommentService.getCommentById(articleId);
    }
  
    @Post('/comments')
    createArticle(@Body() data: CreateCommentDto) {
      return this.CommentService.createArticle(
        data.comment,
      );
    }
  
    @Put('/comments/:id')
    updateArticle(
      @Param('id') articleId: number,
      @Body() data: UpdateCommentDto,
    ) {
      return this.CommentService.updateArticle(
        articleId,
        data.comment,
      );
    }
  
    @Delete('/comments/:id')
    deleteArticle(
      @Param('id') articleId: number,
      @Body() data: DeleteCommentDto,
    ) {
      return this.CommentService.deleteArticle(articleId, data.password);
    }
  }

