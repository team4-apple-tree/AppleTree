import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../entity/card.entity';
import { CreateCardDto } from '../dto/card/create-card-dto';
import { UpdateCardDto } from '../dto/card/update-card.dto';
import { GroupService } from 'src/group/group.service';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly groupService: GroupService,
  ) {}

  async getCards(groupId: number): Promise<Card[]> {
    return this.cardRepository.find({
      where: { group: { id: groupId } },
    });
  }

  async getCardById(cardId: number): Promise<Card> {
    const card = await this.cardRepository.findOne({
      where: { cardId },
    });
    if (!card) {
      throw new NotFoundException(`해당 카드 ID ${cardId}를 찾을 수 없습니다.`);
    }
    return card;
  }

  async createCard(
    groupId: number,
    createCardDto: CreateCardDto,
  ): Promise<Card> {
    // if (!createCardDto.title || !createCardDto.desc) {
    //   throw new BadRequestException('제목 또는 내용을 입력해주세요.');
    // }
    const group = await this.groupService.findGroup(groupId);

    const card = this.cardRepository.create({
      ...createCardDto,
      group,
    });
    return this.cardRepository.save(card);
  }

  async updateCard(
    cardId: number,
    updateCardDto: UpdateCardDto,
  ): Promise<Card> {
    if (!updateCardDto.title || !updateCardDto.desc) {
      throw new BadRequestException('제목 또는 내용을 입력해주세요.');
    }

    const cardToUpdate = await this.cardRepository.findOne({
      where: { cardId },
    });
    if (!cardToUpdate) {
      throw new NotFoundException(`해당 카드 ID ${cardId}를 찾을 수 없습니다.`);
    }

    cardToUpdate.title = updateCardDto.title;
    cardToUpdate.desc = updateCardDto.desc;

    return this.cardRepository.save(cardToUpdate);
  }

  async deleteCard(cardId: number): Promise<void> {
    const cardToDelete = await this.cardRepository.findOne({
      where: { cardId },
    });
    if (!cardToDelete) {
      throw new NotFoundException(`해당 카드 ID ${cardId}를 찾을 수 없습니다.`);
    }

    await this.cardRepository.softDelete(cardToDelete);
  }
}
