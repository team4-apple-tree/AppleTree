import { Test, TestingModule } from '@nestjs/testing';
import { RoomStructureService } from './room-structure.service';
import { RoomStructureModule } from './room-structure.module';
import { Repository } from 'typeorm';
import { RoomStructure } from 'src/entity/roomStructure.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';

describe('RoomStructureService', () => {
  let service: RoomStructureService;
  let roomStructureRepository: Repository<RoomStructure>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RoomStructureModule, TypeOrmModule.forRoot()],
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
