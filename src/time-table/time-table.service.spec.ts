import { Test, TestingModule } from '@nestjs/testing';
import { TimeTableService } from './time-table.service';

describe('TimeTableService', () => {
  let service: TimeTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeTableService],
    }).compile();

    service = module.get<TimeTableService>(TimeTableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
