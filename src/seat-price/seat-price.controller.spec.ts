import { Test, TestingModule } from '@nestjs/testing';
import { SeatPriceController } from './seat-price.controller';

describe('SeatPriceController', () => {
  let controller: SeatPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeatPriceController],
    }).compile();

    controller = module.get<SeatPriceController>(SeatPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
