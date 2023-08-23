import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './board/board.module';
import { CommentModule } from './comment/comment.module';
import { PostModule } from './post/post.module';
import { ToDoModule } from './to-do/to-do.module';
import { GroupModule } from './group/group.module';
import { RoomModule } from './room/room.module';
import { SeatModule } from './seat/seat.module';
import { CardModule } from './card/card.module';
// import { MemberModule } from './member/member.module';
import { UserModule } from './user/user.module';
import { TypeOrmConfigService } from './config/typeorm.config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from './middleware/auth';
import { JwtConfigService } from './config/jwt.config.service';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
    BoardModule,
    CommentModule,
    PostModule,
    ToDoModule,
    GroupModule,
    RoomModule,
    SeatModule,
    CardModule,
    // MemberModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        // 예외 url 지정
        { path: 'user/sign', method: RequestMethod.POST },
        { path: 'user/login', method: RequestMethod.POST },
      )
      .forRoutes('*'); // middleware를 모든 경로에 적용
  }
}
