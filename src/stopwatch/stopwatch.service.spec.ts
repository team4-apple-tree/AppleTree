import { Test, TestingModule } from '@nestjs/testing';
import { StopwatchService } from './stopwatch.service';
import { StopwatchModule } from './stopwatch.module';

describe('StopwatchesService', () => {
  let service: StopwatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StopwatchModule],
      providers: [StopwatchService],
    }).compile();

    service = module.get<StopwatchService>(StopwatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
