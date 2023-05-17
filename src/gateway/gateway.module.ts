import { Module } from '@nestjs/common';
import { UserGatewayController } from './user.gateway.controller';

@Module({
  controllers: [UserGatewayController],
})
export class GatewayModule {}
