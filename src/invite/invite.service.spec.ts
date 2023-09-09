import { Test, TestingModule } from '@nestjs/testing';
import { InviteService } from './invite.service';
import { InviteModule } from './invite.module';
import { Repository } from 'typeorm';
import { Invitation } from 'src/entity/invite.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('InviteService', () => {
  let service: InviteService;
  let invitationRepository: Repository<Invitation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [InviteModule],
      providers: [InviteService],
    }).compile();

    service = module.get<InviteService>(InviteService);
    invitationRepository = module.get<Repository<Invitation>>(
      getRepositoryToken(Invitation),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
