import { LoggerService } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV;
const logDir = __dirname + '/../../logs';
import { Logger } from 'winston';

@Injectable()
export class MyLogger implements LoggerService {
  private readonly logger: Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: { service: 'user-service' },
      transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new winston.transports.File({
          filename: 'new_logs/new_error2.log',
          level: 'error',
        }),
        new winston.transports.File({ filename: 'new_logs/new_combined2.log' }),
      ],
    });

    // this.logger.on('finish', function (info) {});

    // this.logger.end();
  }
  log(message: string) {
    console.log('CALLED Log function');
    this.logger.info(message, { seriously: true });
    this.logger.end();
  }

  error(message: string, trace: string) {
    // 에러 로그 기록
    this.logger.error(message, trace);
  }

  warn(message: string) {
    // 경고 로그 기록
    this.logger.warn(message);
  }
}

// ]}
//   )}

// new winston.transports.Stream({
//   level: 'http',
//   stream: fs.createWriteStream(path.join(logDir,'access.log'), { flags: 'a' }),
// }),
// new winston.transports.DailyRotateFile({
//   level: 'info', // 어떤 레벨을 log에 남길것인가 변경 전 info
//   datePattern: 'YYYY-MM-DD',  // 날짜
//   dirname: path.join(logDir, 'info'), // 파일 경로
//   filename: 'info-%DATE%.log', // 파일 경로 내 파일 이름
//   maxFiles: 30, //파일의 총 개수
//   zippedArchive: false, //
//   maxSize: '20m',
// }),
//     new DailyRotateFile({
//       level: 'warn',
//       datePattern: 'YYYY-MM-DD',
//       dirname: `${logDir}/warn`,
//       filename: `%DATE%.warn.log.txt`,
//       maxFiles: 30,
//       zippedArchive: false,
//       maxSize: '20m',
//     }),
//     new DailyRotateFile({
//       level: 'error',
//       datePattern: 'YYYY-MM-DD',
//       dirname: `${logDir}/error`,
//       filename: `%DATE%.error.log.txt`,
//       maxFiles: 30,
//       zippedArchive: false,
//       maxSize: '20m',
//     }),
//     new DailyRotateFile({
//       level: 'http',
//       datePattern: 'YYYY-MM-DD',
//       dirname: `${logDir}/http`,
//       filename: `%DATE%.http.log.txt`,
//       maxFiles: 30,
//       zippedArchive: false,
//       maxSize: '20m',
//     }),
//   ],
// });
