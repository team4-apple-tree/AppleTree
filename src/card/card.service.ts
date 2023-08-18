import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../entity/card.entity';
import { CreateCardDto } from '../dto/card/create-card-dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async getCards(): Promise<Card[]> {
    return this.cardRepository.find();
  }

  async createCard(createCardDto: CreateCardDto): Promise<Card> {
    const card = this.cardRepository.create(createCardDto);
    return this.cardRepository.save(card);
  }

  async updateCard(
    cardId: number,
    createCardDto: CreateCardDto,
  ): Promise<Card> {
    const cardToUpdate = await this.cardRepository.findOne({
      where: { cardId },
    });
    if (!cardToUpdate) {
      throw new NotFoundException('Card not found');
    }

    cardToUpdate.title = createCardDto.title;
    cardToUpdate.desc = createCardDto.desc;

    return this.cardRepository.save(cardToUpdate);
  }

  async deleteCard(cardId: number): Promise<void> {
    const cardToDelete = await this.cardRepository.findOne({
      where: { cardId },
    });
    if (!cardToDelete) {
      throw new NotFoundException('Card not found');
    }

    await this.cardRepository.remove(cardToDelete);
  }
}
