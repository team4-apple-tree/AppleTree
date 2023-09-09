import { Test, TestingModule } from '@nestjs/testing';
import { StopwatchController } from './stopwatch.controller';
import { StopwatchModule } from './stopwatch.module';

describe('StopwatchesController', () => {
  let controller: StopwatchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StopwatchModule],
      controllers: [StopwatchController],
    }).compile();

    controller = module.get<StopwatchController>(StopwatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
