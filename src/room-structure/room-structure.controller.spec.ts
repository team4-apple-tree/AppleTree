import { Test, TestingModule } from '@nestjs/testing';
import { RoomStructureController } from './room-structure.controller';
import { RoomStructureModule } from './room-structure.module';

describe('RoomStructureController', () => {
  let controller: RoomStructureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RoomStructureModule],
      controllers: [RoomStructureController],
    }).compile();

    controller = module.get<RoomStructureController>(RoomStructureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
