import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import _ from 'lodash';
  
  @Injectable()
  export class BoardService {
    // db 미사용
    private articles = [];
  
    // 게시글 비밀번호를 저장하기 위한 Map 객체입니다.
    private articlePasswords = new Map();
  
    getArticles() {
      return this.articles;
    }
  
    getArticleById(id: number) {
      return this.articles.find((article) => return article.id === id);
    }
  
    createArticle(title: string, content: string, password: number) {
      const articleId = this.articles.length + 1;
      this.articles.push({ id: articleId, title, content });
      this.articlePasswords.set(articleId, password);
      return articleId;
    }
  
    updateArticle(id: number, title: string, content: string, password: number) {
      if (this.articlePasswords.get(id) !== password) {
        throw new UnauthorizedException(
          `Article password is not correct. id: ${id}`,
        );
      }
  
      const article = this.getArticleById(id);
      if (_.isNil(article)) {
        throw new NotFoundException(`Article not found. id: ${id}`);
      }
  
      article.title = title;
      article.content = content;
    }
  
    deleteArticle(id: number, password: number) {
      if (this.articlePasswords.get(id) !== password) {
        throw new UnauthorizedException(
          `Article password is not correct. id: ${id}`,
        );
      }
  
      this.articles = this.articles.filter((article) => article.id !== id);
    }
  }
