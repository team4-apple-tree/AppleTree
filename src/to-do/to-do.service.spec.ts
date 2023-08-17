import { Test, TestingModule } from '@nestjs/testing';
import { ToDoService } from './to-do.service';

describe('ToDoService', () => {
  let service: ToDoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ToDoService],
    }).compile();

    service = module.get<ToDoService>(ToDoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
