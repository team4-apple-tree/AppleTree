import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './to-do.service';
import { ToDoModule } from './to-do.module';
import { Repository } from 'typeorm';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from 'src/entity/to-do.entity';
import { Card } from 'src/entity/card.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from 'src/config/typeorm.config.service';

describe('ToDoService', () => {
  let service: TodoService;
  let todoRepository: Repository<Todo>;
  let cardRepository: Repository<Card>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ToDoModule,
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useClass: TypeOrmConfigService,
          inject: [ConfigService],
        }),
      ],
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
