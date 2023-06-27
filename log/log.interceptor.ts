import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Logger, createLogger } from 'winston';
import { LogWinstonConfig } from './winston.configs';
import { JwtService } from '@nestjs/jwt';
import {
  ErrorLogEntryDto,
  RequestLogEntryDto,
  ResponseLogEntryDto,
} from './log.format.entry.dto';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger: Logger;

  constructor() {
    this.logger = createLogger(LogWinstonConfig);
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const jwtService: JwtService = new JwtService({
      secret: 'jwtSecret',
      signOptions: {
        expiresIn: 60 * 60 * 60,
      },
    });
    const request: any = context.switchToHttp().getRequest();
    const ip =
      request?.headers['x-forwarded-for'] ||
      request?.headers['x-real-ip'] ||
      request?.connection?.remoteAddress ||
      '';
    const token = request?.headers?.authorization?.split(' ')[1];
    let userInfo = null;
    if (token) {
      const user = jwtService.verify(token);
      userInfo = user;
    }
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
    const requestLogEntry: RequestLogEntryDto = new RequestLogEntryDto({
      level: 'info',
      message: 'TEST',
      type: 'Request',
      context: 'Your Log Context',
      ip: ip,
      ClassName: ClassName,
      FunctionName: FunctionName,
      originalUrl: originalUrl,
      method: method,
      requestInfo: requestInfo,
      userInfo: userInfo,
    });
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
          userInfo: userInfo,
          return: controllerReturnValue,
        });
        this.logger.log(responseLogEntry);
      }),
      catchError((error) => {
        const errorMessage = error?.message;
        const stackTrace = error?.stack;
        const errorLogEntry = new ErrorLogEntryDto({
          level: 'error',
          message: 'Error',
          type: 'Error',
          context: 'Your Log Context',
          ip: ip,
          ClassName: ClassName,
          FunctionName: FunctionName,
          errorMessage: errorMessage,
          stackTrace: stackTrace,
          userInfo: userInfo,
        });

        if (error.response?.data.statusCode) {
          const responseLogEntry = new ResponseLogEntryDto({
            level: 'info',
            message: 'TEST',
            type: 'Response',
            ip: ip,
            ClassName: ClassName,
            FunctionName: FunctionName,
            context: 'Your Log Context',
            userInfo,
            return: error.response.data,
          });
          this.logger.log(responseLogEntry);
        } else this.logger.error(errorLogEntry);
        return throwError(() => error);
      }),
    );
  }
}
