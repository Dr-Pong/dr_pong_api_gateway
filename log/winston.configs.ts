import { WinstonModuleOptions, utilities } from 'nest-winston';
import * as winston from 'winston';

const logMessageFormatter = ({ level, message, label, timestamp, meta }) => {
  const ip =
    meta?.request?.ip ||
    meta?.request?.headers['x-forwarded-for'] ||
    meta?.request?.connection.remoteAddress;
  //   const logMessage = `${timestamp} [${label}] ${level}: ${message}`;
  if (ip) {
    return `${timestamp} [${ip}] : [${label}] ${level}: ${message}`;
  }
  return `${timestamp} [${label}] ${level}: ${message}`;
};

export const winstonConfig: WinstonModuleOptions = {
  levels: {
    error: 0,
    webserver_error: 1,
    gameserver_error: 2,
    chatserver_error: 3,
    warn: 4,
    info: 5,
    debug: 6,
    silly: 7,
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    // winston.format.label({ label: 'Default' }),
    // utilities.format.nestLike('Dr_pong', { prettyPrint: true }),
    winston.format.colorize({
      all: true,
      colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        debug: 'blue',
      },
    }),

    winston.format.printf(({ level, message, label, timestamp, meta }) => {
      const ip =
        meta?.request?.ip ||
        meta?.request?.headers['x-forwarded-for'] ||
        meta?.request?.connection.remoteAddress;
      return `${timestamp} [${label}] ${level}: ${message} IP: ${ip}`;
    }),
    // utilities.format.nestLike('Dr_pong', { prettyPrint: true }),
  ),
  transports: [
    new winston.transports.File({
      filename: 'booting.log',
      dirname: 'log', // Optional, if you want to specify the folder for logs
      //   level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
      level: 'silly', // or your desired level
      format: winston.format.combine(
        winston.format.label({ label: 'BOOT' }),
        winston.format.timestamp(),
        winston.format.printf(logMessageFormatter),
      ),
    }),
    new winston.transports.File({
      filename: 'webserver.log',
      dirname: 'log/webserver',
      silent: true,
      level: 'debug',
      format: winston.format.combine(
        winston.format.label({ label: 'WEBSERVER' }),
        winston.format.timestamp(),
        winston.format.printf(logMessageFormatter),
      ),
    }),
    new winston.transports.File({
      filename: 'gameserver.log',
      dirname: 'log/gameserver',
      silent: true,
      level: 'debug',
      format: winston.format.combine(
        winston.format.label({ label: 'GAMESERVER' }),
        winston.format.timestamp(),
        winston.format.printf(logMessageFormatter),
      ),
    }),
    new winston.transports.File({
      filename: 'chatserver.log',
      dirname: 'log/chatserver',
      silent: true,
      level: 's',
      format: winston.format.combine(
        winston.format.label({ label: 'CHATSERVER' }),
        winston.format.timestamp(),
        winston.format.printf(logMessageFormatter),
      ),
    }),
    // new winston.transports.File({
    //   filename: 'footstep.log',
    //   dirname: 'log',
    //   level: 'info', // or your desired level for routing logs
    //   silent: true,
    //   format: winston.format.combine(
    //     // winston.format.timestamp(),
    //     winston.format.label({ label: 'FOOTSTEP' }),
    //     utilities.format.nestLike('FOOTSTEP', { prettyPrint: true }),
    //   ),
    // }),
    new winston.transports.File({
      filename: 'error.log',
      dirname: 'log',
      level: 'error', // or your desired level for error logs
      format: winston.format.combine(
        // winston.format.timestamp(),
        utilities.format.nestLike('ERROR', { prettyPrint: true }),
      ),
    }),
    new winston.transports.File({
      filename: 'chatserver_error.log',
      dirname: 'log/chatserver',
      level: 'chatserver_error',
    //   silent: true,
      format: winston.format.combine(
        winston.format.label({ label: 'CHATSERVER_ERROR' }),
        winston.format.timestamp(),
        winston.format.printf(logMessageFormatter),
      ),
    }),
    new winston.transports.File({
      filename: 'webserver_error.log',
      dirname: 'log/webserver',
      level: 'webserver_error',
    //   silent: true,
      format: winston.format.combine(
        winston.format.label({ label: 'WEBSERVER_ERROR' }),
        winston.format.timestamp(),
        winston.format.printf(logMessageFormatter),
      ),
    }),
    new winston.transports.File({
      filename: 'gameserver_error.log',
      dirname: 'log/gameserver',
      level: 'gameserver_error',
    //   silent: true,
      format: winston.format.combine(
        winston.format.label({ label: 'GAMESERVER_ERROR' }),
        winston.format.timestamp(),
        winston.format.printf(logMessageFormatter),
      ),
    }),
  ],
};
