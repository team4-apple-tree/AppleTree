import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './to-do.service';
import { ToDoModule } from './to-do.module';

describe('ToDoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ToDoModule],
      providers: [TodoService],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
