import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  Logger,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GroupModule } from './group/group.module';
import { RoomModule } from './room/room.module';
import { SeatModule } from './seat/seat.module';
import { CardModule } from './card/card.module';
import { UserModule } from './user/user.module';
import { TypeOrmConfigService } from './config/typeorm.config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtConfigService } from './config/jwt.config.service';
import { JwtModule } from '@nestjs/jwt';
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
import { ChatModule } from './chat/chat.module';
import { SeatPriceModule } from './seat-price/seat-price.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { RoomStructureModule } from './room-structure/room-structure.module';
import { TimeTableModule } from './time-table/time-table.module';

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
    // MailerModule 설정 추가
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: process.env.SMTP_HOST,
          port: 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: process.cwd() + '/template/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    GroupModule,
    RoomModule,
    SeatModule,
    CardModule,
    UserModule,
    PaymentModule,
    ChatModule,
    RoomStructureModule,
    TimeTableModule,
    SeatPriceModule,
  ],
  controllers: [AppController, PaymentController],
  providers: [
    AppService,
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
