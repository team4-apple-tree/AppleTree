import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfigService } from '../config/jwt.config.service';
import { User } from '../entity/user.entity';
import { JwtAuthGuard } from './jwt.guard';
import { RolesGuard } from './roles.guard';
import { SocketGuard } from './socket.guard';
import { Member } from 'src/entity/member.entity';
import { Point } from 'src/entity/point.entity';
import { S3Service } from 'src/aws.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Member, Point]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
  ],
  providers: [UserService, JwtAuthGuard, RolesGuard, SocketGuard, S3Service],
  controllers: [UserController],
  exports: [UserService, SocketGuard],
})
export class UserModule {}
