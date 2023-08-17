import { Test, TestingModule } from '@nestjs/testing';
import { ToDoController } from './to-do.controller';

describe('ToDoController', () => {
  let controller: ToDoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToDoController],
    }).compile();

    controller = module.get<ToDoController>(ToDoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
