import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PostModule } from './post.module';

describe('PostService', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PostModule],
      providers: [PostService],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
