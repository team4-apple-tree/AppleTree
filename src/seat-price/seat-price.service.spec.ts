import { Test, TestingModule } from '@nestjs/testing';
import { SeatPriceService } from './seat-price.service';
import { SeatPriceModule } from './seat-price.module';

describe('SeatPriceService', () => {
  let service: SeatPriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SeatPriceModule],
      providers: [SeatPriceService],
    }).compile();

    service = module.get<SeatPriceService>(SeatPriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
