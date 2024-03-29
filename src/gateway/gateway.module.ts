import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import {
  ChatserverModule,
  GameserverModule,
  WebserverModule,
} from './chatserver/servers.gateway.module';
@Module({
  imports: [WebserverModule, ChatserverModule, GameserverModule],
})
export class GatewayModule {}
