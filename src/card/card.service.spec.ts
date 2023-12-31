import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';
import { CardModule } from './card.module';
import { Repository } from 'typeorm';
import { Card } from 'src/entity/card.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from 'src/config/typeorm.config.service';
import { GroupModule } from 'src/group/group.module';

describe('CardService', () => {
  let service: CardService;
  let cardRepository: Repository<Card>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CardModule,
        GroupModule,
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useClass: TypeOrmConfigService,
          inject: [ConfigService],
        }),
      ],
      providers: [CardService],
    }).compile();

    service = module.get<CardService>(CardService);
    cardRepository = module.get<Repository<Card>>(getRepositoryToken(Card));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
