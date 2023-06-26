import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { LogWinstonConfig } from './winston.configs';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory() {
        return LogWinstonConfig;
      },
    }),
  ],
})
export class PongLoggerModule {}
