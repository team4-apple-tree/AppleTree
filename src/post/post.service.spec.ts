import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PostModule } from './post.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('PostService', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PostModule, TypeOrmModule.forRoot()],
      providers: [PostService],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
