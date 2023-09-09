import { Test, TestingModule } from '@nestjs/testing';
import { InviteService } from './invite.service';
import { InviteModule } from './invite.module';

describe('InviteService', () => {
  let service: InviteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [InviteModule],
      providers: [InviteService],
    }).compile();

    service = module.get<InviteService>(InviteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
