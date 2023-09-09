import { Test, TestingModule } from '@nestjs/testing';
import { SeatController } from './seat.controller';
import { SeatModule } from './seat.module';

describe('SeatController', () => {
  let controller: SeatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SeatModule],
      controllers: [SeatController],
    }).compile();

    controller = module.get<SeatController>(SeatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
