import { Test, TestingModule } from '@nestjs/testing';
import { InviteService } from './invite.service';
import { InviteModule } from './invite.module';
import { Repository } from 'typeorm';
import { Invitation } from 'src/entity/invite.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from 'src/config/typeorm.config.service';

describe('InviteService', () => {
  let service: InviteService;
  let invitationRepository: Repository<Invitation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        InviteModule,
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useClass: TypeOrmConfigService,
          inject: [ConfigService],
        }),
      ],
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
