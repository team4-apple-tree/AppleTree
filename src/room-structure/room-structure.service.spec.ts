import { Test, TestingModule } from '@nestjs/testing';
import { RoomStructureService } from './room-structure.service';
import { RoomStructureModule } from './room-structure.module';
import { Repository } from 'typeorm';
import { RoomStructure } from 'src/entity/roomStructure.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from 'src/config/typeorm.config.service';
import { SeatModule } from 'src/seat/seat.module';

describe('RoomStructureService', () => {
  let service: RoomStructureService;
  let roomStructureRepository: Repository<RoomStructure>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RoomStructureModule,
        SeatModule,
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useClass: TypeOrmConfigService,
          inject: [ConfigService],
        }),
      ],
      providers: [RoomStructureService],
    }).compile();

    service = module.get<RoomStructureService>(RoomStructureService);
    roomStructureRepository = module.get<Repository<RoomStructure>>(
      getRepositoryToken(RoomStructure),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
