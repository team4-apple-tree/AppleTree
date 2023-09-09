import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './to-do.service';
import { ToDoModule } from './to-do.module';
import { Repository } from 'typeorm';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from 'src/entity/to-do.entity';
import { Card } from 'src/entity/card.entity';

describe('ToDoService', () => {
  let service: TodoService;
  let todoRepository: Repository<Todo>;
  let cardRepository: Repository<Card>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ToDoModule, TypeOrmModule.forRoot()],
      providers: [TodoService],
    }).compile();

    service = module.get<TodoService>(TodoService);
    todoRepository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
    cardRepository = module.get<Repository<Card>>(getRepositoryToken(Card));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
