import { WinstonModuleOptions } from 'nest-winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as winston from 'winston';
import * as moment from 'moment-timezone';

const customTimestampFormat = winston.format((info) => {
  info.timestamp = moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
  return info;
});

const logFormatter = ({
  level,
  context,
  message,
  label,
  timestamp,
  metadata,
}) => {
  const {
    ip,
    type,
    ClassName,
    FunctionName,
    return: returnValue,
    originalUrl,
    method,
    requestInfo,
    userInfo,
  } = metadata;
  if (returnValue || returnValue === '')
    return `[${ip}] ${type} ${timestamp} [User: ${JSON.stringify(
      userInfo,
    )}] ${label} [Class: ${ClassName}] [Function: ${FunctionName}] ${message} ${JSON.stringify(
      returnValue,
    )}`;
  return `[${ip}] ${type} ${timestamp} [User : ${JSON.stringify(
    userInfo,
  )}]   ${label} [Class: ${ClassName}] [Function: ${FunctionName}] ${message} ${originalUrl} ${method} ${JSON.stringify(
    requestInfo,
  )}`;
};

const errorMessageFormatter = ({
  level,
  message,
  context,
  label,
  timestamp,
  metadata,
}) => {
  const {
    ip,
    type,
    ClassName,
    FunctionName,
    errorMessage,
    stackTrace,
    userInfo,
  } = metadata;
  return `[${ip}] ${type} ${timestamp} ${label} [User: ${JSON.stringify(
    userInfo,
  )}] [Class: ${ClassName}] [Function: ${FunctionName}] ${errorMessage} ${stackTrace}`;
};

export const LogWinstonConfig: WinstonModuleOptions = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    silly: 4,
  },
  transports: [
    new DailyRotateFile({
      dirname: `log/%DATE%`,
      filename: '%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.metadata(),
        winston.format.label({ label: 'LOG' }),
        customTimestampFormat(),
        winston.format.printf(logFormatter),
      ),
    }),
    new DailyRotateFile({
      dirname: `log/%DATE%`,
      filename: '%DATE%_error.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
      format: winston.format.combine(
        winston.format.metadata(),
        winston.format.errors({ stack: true }),
        winston.format.label({ label: 'ERROR' }),
        customTimestampFormat(),
        winston.format.printf(errorMessageFormatter),
      ),
    }),
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      dirname: `log/%DATE%`,
      filename: `%DATE%.exception.log`,
      datePattern: 'YYYY-MM-DD',
      maxFiles: 30,
      level: 'error',
      format: winston.format.combine(
        winston.format.metadata(),
        winston.format.errors({ stack: true }),
        winston.format.label({ label: 'EERROR' }),
        customTimestampFormat(),
        winston.format.printf(errorMessageFormatter),
      ),
    }),
  ],
};
