import { Test, TestingModule } from '@nestjs/testing';
import { SeatService } from './seat.service';
import { SeatModule } from './seat.module';

describe('SeatService', () => {
  let service: SeatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SeatModule],
      providers: [SeatService],
    }).compile();

    service = module.get<SeatService>(SeatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
