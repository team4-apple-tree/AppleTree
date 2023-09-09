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
        new winston.transports.File({ filename: 'new_logs/new_combined2.log' }), // 해당 파일에 로그 작성
      ],
      exitOnError: false,
    });

  }
  async log(message: string) {
    console.log('CALLED Log function');
    this.logger.info(message, { seriously: true });
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