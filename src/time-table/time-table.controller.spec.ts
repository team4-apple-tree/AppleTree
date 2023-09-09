import { Test, TestingModule } from '@nestjs/testing';
import { TimeTableController } from './time-table.controller';

describe('TimeTableController', () => {
  let controller: TimeTableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeTableController],
    }).compile();

    controller = module.get<TimeTableController>(TimeTableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
