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

export class ResponseLogEntryDto {
  level: string;
  message: string;
  type: string;
  ip: string;
  ClassName: string;
  FunctionName: string;
  context: string;
  return: any; // 일단 any 여기에 성공한 리턴값이 담길수도 있고, 실패한 리턴값이 담길수도 있음

  constructor(data: Partial<ResponseLogEntryDto>) {
    Object.assign(this, data);
  }
}

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
        const responseLogEntry = new ResponseLogEntryDto({
          level: 'info',
          message: 'TEST',
          type: 'Response',
          ip: ip,
          ClassName: ClassName,
          FunctionName: FunctionName,
          context: 'Your Log Context',
          return: controllerReturnValue,
        });
        this.logger.log(responseLogEntry);
      }),
      catchError((error) => {
        const errorMessage = error?.message;
        const stackTrace = error?.stack;
        const timestamp = new Date().toISOString();
        const user = request?.user;
        // const serverVersion = process.env.SERVER_VERSION;
        // const os = process.platform;
        // const hostname = process.env.HOSTNAME;

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
          error,
        };
        if (error.response?.data.statusCode) {
          const responseLogEntry = new ResponseLogEntryDto({
            level: 'info',
            message: 'TEST',
            type: 'Response',
            ip: ip,
            ClassName: ClassName,
            FunctionName: FunctionName,
            context: 'Your Log Context',
            return: error.response.data,
          });
          this.logger.log(responseLogEntry);
        } else this.logger.error(errorLogEntry);
        return throwError(() => error);
      }),
    );
  }
}
