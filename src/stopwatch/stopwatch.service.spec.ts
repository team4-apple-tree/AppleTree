import { Test, TestingModule } from '@nestjs/testing';
import { StopwatchService } from './stopwatch.service';
import { StopwatchModule } from './stopwatch.module';
import { Repository } from 'typeorm';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Stopwatch } from 'src/entity/stopwatch.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from 'src/config/typeorm.config.service';

describe('StopwatchesService', () => {
  let service: StopwatchService;
  let stopwatchRepository: Repository<Stopwatch>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        StopwatchModule,
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useClass: TypeOrmConfigService,
          inject: [ConfigService],
        }),
      ],
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
