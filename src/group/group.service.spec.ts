import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from './group.service';
import { GroupModule } from './group.module';
import { Repository } from 'typeorm';
import { Group } from 'src/entity/group.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Member } from 'src/entity/member.entity';
import { Access } from 'src/entity/access.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from 'src/config/typeorm.config.service';

describe('GroupService', () => {
  let service: GroupService;
  let memberRepository: Repository<Member>;
  let groupRepository: Repository<Group>;
  let accessRepository: Repository<Access>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        GroupModule,
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useClass: TypeOrmConfigService,
          inject: [ConfigService],
        }),
      ],
      providers: [GroupService],
    }).compile();

    service = module.get<GroupService>(GroupService);
    groupRepository = module.get<Repository<Group>>(getRepositoryToken(Group));
    memberRepository = module.get<Repository<Member>>(
      getRepositoryToken(Member),
    );
    accessRepository = module.get<Repository<Access>>(
      getRepositoryToken(Access),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
