import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from '../dto/card/create-card-dto';
import { Card } from '../entity/card.entity';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get('/room/:groupId')
  async getCards(@Param('groupId') groupId: number): Promise<Card[]> {
    return this.cardService.getCards(groupId);
  }

  @Get('/:id')
  async getCardById(@Param('id') cardId: number): Promise<Card> {
    const card = await this.cardService.getCardById(cardId);
    return card;
  }

  @Post('/room/:groupId')
  async createCardInTodo(
    @Param('groupId') groupId: number,
    @Body() createCardDto: CreateCardDto,
  ): Promise<Card> {
    // 먼저 해당 todoId의 Todo가 존재하는지 확인
    // const todo = await this.todoService.getTodoById(groupId);

    // Todo에 Card 생성
    // return this.todoService.createCardInTodo(groupId, createCardDto);
    return this.cardService.createCard(groupId, createCardDto);
  }

  @Put('/:id')
  async updateCard(
    @Param('id') cardId: number,
    @Body() updateCardDto: CreateCardDto,
  ): Promise<Card> {
    return this.cardService.updateCard(cardId, updateCardDto);
  }

  @Delete('/:id')
  async deleteCard(@Param('id') cardId: number): Promise<void> {
    return this.cardService.deleteCard(cardId);
  }
}
