import { Test, TestingModule } from '@nestjs/testing';
import { SeatPriceService } from './seat-price.service';

describe('SeatPriceService', () => {
  let service: SeatPriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeatPriceService],
    }).compile();

    service = module.get<SeatPriceService>(SeatPriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
