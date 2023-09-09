import { Test, TestingModule } from '@nestjs/testing';
import { SeatPriceController } from './seat-price.controller';
import { SeatPriceModule } from './seat-price.module';

describe('SeatPriceController', () => {
  let controller: SeatPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SeatPriceModule],
      controllers: [SeatPriceController],
    }).compile();

    controller = module.get<SeatPriceController>(SeatPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
