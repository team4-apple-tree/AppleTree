import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardModule } from './card.module';

describe('CardController', () => {
  let controller: CardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CardModule],
      controllers: [CardController],
    }).compile();

    controller = module.get<CardController>(CardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
