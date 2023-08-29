import { Injectable, Logger, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MyLogger } from 'src/utils/winston.util';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(MyLogger) private readonly myLogger: MyLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    // 요청 객체로부터 ip, http method, url, user agent를 받아온 후
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent');

    // HTTP 메소드에 따라 로그 레벨을 동적으로 설정
    const logLevel = method === 'POST' ? 'info' : 'http';

    // 응답이 끝나는 이벤트가 발생하면 로그를 찍는다.
    res.on('finish', () => {
      const { statusCode } = res;
      this.myLogger.log(
        `${method} ${originalUrl} ${statusCode} ${ip} ${userAgent}`,
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
