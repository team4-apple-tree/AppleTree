import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  Logger,
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
import { S3Service } from './aws.service';
import { UploadService } from './upload.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PaymentService } from './payment/payment.service';
import { PaymentController } from './payment/payment.controller';
import { PaymentGateway } from './payment/payment.gateway';
import { PaymentModule } from './payment/payment.module';
import { MyLogger } from './utils/winston.util';
import { LoggerMiddleware } from './middleware/logger';
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
    MulterModule.register({
      storage: diskStorage({
        destination: (req, res, cb) => {
          cb(null, './upload/');
        },
        filename: (req, file, cb) => {
          const fileName = Buffer.from(file.originalname, 'latin1').toString(
            'utf8',
          );

          cb(null, Date.now() + '-' + fileName);
        },
      }),
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
    PaymentModule,
  ],
  controllers: [AppController, PaymentController],
  providers: [
    AppService,
    ChatGateway,
    S3Service,
    UploadService,
    PaymentService,
    PaymentGateway,
    MyLogger,
    Logger,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
