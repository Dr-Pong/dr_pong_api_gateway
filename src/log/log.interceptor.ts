import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
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
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: +process.env.JWT_EXPIRATION_TIME,
      },
    });
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

    const token = request?.headers?.authorization?.split(' ')[1];
    let userInfo = null;
    try {
      const user = jwtService.verify(token);
      userInfo = user;
    } catch (error) {
      const errorLogEntry = new ErrorLogEntryDto({
        level: 'error',
        message: 'Error',
        type: 'Error',
        context: 'Your Log Context',
        ip: ip,
        ClassName: ClassName,
        FunctionName: FunctionName,
        errorMessage: error.message,
        stackTrace: error.stack,
        userInfo: userInfo,
      });
      this.logger.error(errorLogEntry);
    }

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
        let statusCode, output;
        if (Object.prototype.hasOwnProperty.call(error.response, 'data')) {
          statusCode = error.response.data.statusCode;
          output = error.response.data;
        } else {
          statusCode = error.response.statusCode;
          output = error.response;
        }
        if (statusCode < 500) {
          const responseLogEntry = new ResponseLogEntryDto({
            level: 'info',
            message: 'TEST',
            type: 'Response',
            ip: ip,
            ClassName: ClassName,
            FunctionName: FunctionName,
            context: 'Your Log Context',
            userInfo,
            return: output,
          });
          this.logger.log(responseLogEntry);
        } else {
          this.logger.error(errorLogEntry);
          const customError = new HttpException('Bad Request', 400);
          return throwError(() => customError);
        }
        return throwError(() => output);
      }),
    );
  }
}
