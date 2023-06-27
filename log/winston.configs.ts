import { WinstonModuleOptions } from 'nest-winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as winston from 'winston';

const logFormatter = ({
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
    return: returnValue,
    originalUrl,
    method,
    requestInfo,
  } = metadata;
  if (returnValue)
    return `[${ip}]  ${type} ${timestamp}     ${label} [Class : ${ClassName}] [Function : ${FunctionName}] ${message} ${JSON.stringify(
      returnValue,
    )}`;
  return `[${ip}]  ${type} ${timestamp}     ${label} [Class : ${ClassName}] [Function : ${FunctionName}] ${message} ${originalUrl} ${method}  ${JSON.stringify(
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
    user,
    serverVersion,
    os,
    hostname,
  } = metadata;
  return `[${ip}] ${type} ${timestamp} ${label} [Class: ${ClassName}] [Function: ${FunctionName}] ${errorMessage} ${stackTrace}`;
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
      dirname: 'log',
      filename: '%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.metadata(),
        winston.format.label({ label: 'LOG' }),
        winston.format.timestamp(),
        winston.format.printf(logFormatter),
      ),
    }),
    new DailyRotateFile({
      dirname: 'log',
      filename: '%DATE%_error.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
      format: winston.format.combine(
        winston.format.metadata(),
        winston.format.errors({ stack: true }),
        winston.format.label({ label: 'ERROR' }),
        winston.format.timestamp(),
        winston.format.printf(errorMessageFormatter),
      ),
    }),
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: 'log',
      filename: `%DATE%.exception.log`,
      maxFiles: 30,
      format: winston.format.combine(
        winston.format.metadata(),
        winston.format.errors({ stack: true }),
        winston.format.label({ label: 'EERROR' }),
        winston.format.timestamp(),
        winston.format.printf(errorMessageFormatter),
      ),
    }),
  ],
};
