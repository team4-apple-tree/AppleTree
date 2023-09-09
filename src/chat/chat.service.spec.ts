import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { ChatModule } from './chat.module';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ChatModule],
      providers: [ChatService],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
