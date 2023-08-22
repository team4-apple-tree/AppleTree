import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from 'src/entity/group.entity';
import { UserModule } from 'src/user/user.module';
import { Member } from 'src/entity/member.entity';
import { User } from 'src/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, Member, User]), UserModule],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
