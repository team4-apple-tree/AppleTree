import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from 'src/entity/group.entity';
import { UserModule } from 'src/user/user.module';
import { Member } from 'src/entity/member.entity';
import { User } from 'src/entity/user.entity';
import { Access } from 'src/entity/access.entity';
import { S3Service } from 'src/aws.service';
import { UploadService } from 'src/upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, Member, User, Access]),
    UserModule,
  ],
  controllers: [GroupController],
  providers: [GroupService, S3Service, UploadService],
  exports: [GroupService],
})
export class GroupModule {}
