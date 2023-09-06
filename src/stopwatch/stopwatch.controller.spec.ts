import { Test, TestingModule } from '@nestjs/testing';
import { StopwatchController } from './stopwatch.controller';

describe('StopwatchesController', () => {
  let controller: StopwatchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StopwatchController],
    }).compile();

    controller = module.get<StopwatchController>(StopwatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
