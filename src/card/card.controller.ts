import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from '../dto/card/create-card-dto';
import { Card } from '../entity/card.entity';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get('/cards')
  async getCards(): Promise<Card[]> {
    return this.cardService.getCards();
  }

  @Post('/cards')
  async createCard(@Body() cardData: Card): Promise<Card> {
    return this.cardService.createCard(cardData);
  }

  @Put('/cards/:id')
  async updateCard(
    @Param('id') cardId: number,
    @Body() cardData: Card,
  ): Promise<Card> {
    return this.cardService.updateCard(cardId, cardData);
  }

  @Delete('/cards/:id')
  async deleteCard(@Param('id') cardId: number): Promise<void> {
    return this.cardService.deleteCard(cardId);
  }
}
