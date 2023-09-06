import { Test, TestingModule } from '@nestjs/testing';
import { RoomStructureService } from './room-structure.service';

describe('RoomStructureService', () => {
  let service: RoomStructureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomStructureService],
    }).compile();

    service = module.get<RoomStructureService>(RoomStructureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
