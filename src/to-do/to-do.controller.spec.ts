import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './to-do.controller';
import { ToDoModule } from './to-do.module';

describe('ToDoController', () => {
  let controller: TodoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ToDoModule],
      controllers: [TodoController],
    }).compile();

    controller = module.get<TodoController>(TodoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
