import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './winston.configs';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      // Configure the Winston logger
      useFactory() {
        return winstonConfig;
      },
    }),
  ],
})
export class LoggerModule {}
