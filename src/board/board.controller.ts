import { Controller } from '@nestjs/common';

@Controller('board')
export class BoardController {
    import { Controller, Get, Post, Put, Delete } from '@nestjs/common';

@Controller('board')
export class BoardController {
    // service
    constructor(private readonly boardService: BoardService) {}

    // 게시물 목록 get
    @Get('/articles')
    getArticles() {
        return this.boardService.getArticles();
    }

    // 게시물 상세보기
    @Get('/articles/:id')
    getArticles() {
        return this.boardService.getArticleById(id);
    }

    // 게시물 생성
    @Post('/articles')
    createArticle() {
        return this.boardService.createArticle();
    }

    // 게시물 수정
    @Put('/articles/:id')
    updateArticle() {
        return this.boardService.updateArticle(id);
    }

    // 게시물 삭제
    @Delete('/articles/:id')
    deleteArticle() {
        return this.boardService.deleteArticle(id);
    }
}

}
