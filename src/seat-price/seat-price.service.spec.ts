import { Test, TestingModule } from '@nestjs/testing';
import { SeatPriceService } from './seat-price.service';
import { SeatPriceModule } from './seat-price.module';
import { Repository } from 'typeorm';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { SeatPrice } from 'src/entity/seatPrice.entity';
import { Seat } from 'src/entity/seat.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from 'src/config/typeorm.config.service';

describe('SeatPriceService', () => {
  let service: SeatPriceService;
  let seatRepository: Repository<Seat>;
  let seatPriceRepository: Repository<SeatPrice>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SeatPriceModule,
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useClass: TypeOrmConfigService,
          inject: [ConfigService],
        }),
      ],
      providers: [SeatPriceService],
    }).compile();

    service = module.get<SeatPriceService>(SeatPriceService);
    seatRepository = module.get<Repository<Seat>>(getRepositoryToken(Seat));
    seatPriceRepository = module.get<Repository<SeatPrice>>(
      getRepositoryToken(SeatPrice),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
