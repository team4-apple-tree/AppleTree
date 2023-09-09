import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';
import { CardModule } from './card.module';

describe('CardService', () => {
  let service: CardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CardModule],
      providers: [CardService],
    }).compile();

    service = module.get<CardService>(CardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
