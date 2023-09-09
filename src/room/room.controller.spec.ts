import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from './room.controller';
import { RoomModule } from './room.module';

describe('RoomController', () => {
  let controller: RoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RoomModule],
      controllers: [RoomController],
    }).compile();

    controller = module.get<RoomController>(RoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
