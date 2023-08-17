import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { MemberModule } from './member/member.module';
import { UserModule } from './user/user.module';
import { TypeOrmConfigService } from './config/typeorm.config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal : true}),
    TypeOrmModule.forRootAsync({
      imports : [ConfigModule],
      useClass : TypeOrmConfigService,
      inject : [ConfigService],
    }),
    BoardModule, CommentModule, PostModule, ToDoModule, GroupModule, RoomModule, SeatModule, CardModule, MemberModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware)
    .forRoutes(
      { path : 'user', method : RequestMethod.POST }
    )
  }
}
