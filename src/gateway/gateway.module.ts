import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import {
  ChatserverModule,
  WebserverModule,
} from './chatserver/servers.gateway.module';
@Module({
  imports: [AuthModule, WebserverModule, ChatserverModule],
})
export class GatewayModule {}
