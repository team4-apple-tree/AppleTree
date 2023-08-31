import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from 'src/entity/group.entity';
import { Access } from 'src/entity/access.entity';
import { SocketGuard } from 'src/user/socket.guard';
import { GroupModule } from 'src/group/group.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Group, Access]), UserModule, GroupModule],
  providers: [ChatGateway],
})
export class ChatModule {}
