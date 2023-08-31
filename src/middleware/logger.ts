import {
  Injectable,
  Logger,
  NestMiddleware,
  Inject,
  Body,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/entity/user.entity';
import { MyLogger } from 'src/utils/winston.util';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(MyLogger) private readonly myLogger: MyLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    // 요청 객체로부터 ip, http method, url, user agent를 받아온 후
    const { ip, method, originalUrl, body } = req;
    const { password, ...other } = body;
    // const user = res.locals.user;
    // const { id, ...auth } = user;
    const userAgent = req.get('user-agent');
    console.log(body);

    // HTTP 메소드에 따라 로그 레벨을 동적으로 설정
    const logLevel = method === 'POST' ? 'info' : 'http';

    // 응답이 끝나는 이벤트가 발생하면 로그를 찍는다.
    res.on('finish', () => {
      const { statusCode } = res;
      this.myLogger.log(
        `${method} ${originalUrl} ${statusCode} ${ip} ${userAgent} userId=${JSON.stringify(
          other,
        )} 
     `,
        // 위 백틱안에 추가 유저 정보 가져오기 ${JSON.stringify(id)}
      );
      // this.logger.log(
      //   `${method} ${originalUrl} ${statusCode} ${ip} ${userAgent}`,
      //   { seriously: true },
      // );
      // this.logger.error('Immediately ERROR');
    });
    next();
  }
}
