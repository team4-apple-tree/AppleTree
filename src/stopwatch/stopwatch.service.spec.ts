import { Test, TestingModule } from '@nestjs/testing';
import { StopwatchService } from './stopwatch.service';
import { StopwatchModule } from './stopwatch.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Stopwatch } from 'src/entity/stopwatch.entity';

describe('StopwatchesService', () => {
  let service: StopwatchService;
  let stopwatchRepository: Repository<Stopwatch>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StopwatchModule],
      providers: [StopwatchService],
    }).compile();

    service = module.get<StopwatchService>(StopwatchService);
    stopwatchRepository = module.get<Repository<Stopwatch>>(
      getRepositoryToken(Stopwatch),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
