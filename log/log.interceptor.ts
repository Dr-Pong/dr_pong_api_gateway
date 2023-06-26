import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LogEntry, Logger, createLogger } from 'winston';
import { LogWinstonConfig } from './winston.configs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger: Logger;

  constructor() {
    this.logger = createLogger(LogWinstonConfig);
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: any = context.switchToHttp().getRequest();
    const ip =
      request?.headers['x-forwarded-for'] ||
      request?.headers['x-real-ip'] ||
      request?.connection?.remoteAddress ||
      '';

    const ClassName = context.getClass().name;
    const FunctionName = context.getHandler().name;
    const originalUrl = request?.originalUrl;
    const method = request?.method;
    const body = request?.body;
    const params = request?.params;
    const query = request?.query;

    const requestInfo = {
      originalUrl: originalUrl,
      method: method,
      body: body,
      params: params,
      query: query,
    };

    const requestLogEntry: LogEntry = {
      level: 'info',
      message: 'TEST',
      type: 'Request',
      context: 'Your Log Context',
      ip: ip,
      ClassName: ClassName,
      FunctionName: FunctionName,
      originalUrl: originalUrl,
      method: method,
      body: body,
      params: params,
      query: query,
      requestInfo: requestInfo,
    };

    this.logger.log(requestLogEntry);
    return next.handle().pipe(
      tap((controllerReturnValue) => {
        const responseLogEntry: LogEntry = {
          level: 'info',
          message: 'TEST',
          type: 'Response',
          ip: ip,
          ClassName: ClassName,
          FunctionName: FunctionName,
          context: 'Your Log Context',
          return: controllerReturnValue,
        };
        this.logger.log(responseLogEntry);
      }),
      catchError((error) => {
        const errorMessage = error.message;
        const stackTrace = error.stack;
        const timestamp = new Date().toISOString();
        const user = request?.user;
        const serverVersion = process.env.SERVER_VERSION;
        const os = process.platform;
        const hostname = process.env.HOSTNAME;

        const errorLogEntry: LogEntry = {
          level: 'error',
          message: 'Error',
          type: 'Error',
          context: 'Your Log Context',
          ip,
          ClassName,
          FunctionName,
          errorMessage,
          stackTrace,
          timestamp,
          user,
          serverVersion,
          os,
          hostname,
          error,
        };

        this.logger.error(errorLogEntry);
        return throwError(error); // 오류를 다시 방출합니다.
      }),
    );
  }
}
