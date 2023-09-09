import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';
import { Invitation } from '../entity/invite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invitation])],
  controllers: [InviteController],
  providers: [InviteService],
})
export class InviteModule {}
