import { Module } from '@nestjs/common';
import { UserGatewayCollectablesController } from './webserver/gateway-user-collectables.controller';
import { UserGatewayDetailController } from './webserver/gateway-user-detail-controller.dto';
import { UserGatewayStatRankController } from './webserver/gateway-user-stat-rank-controller';
@Module({
  controllers: [
    UserGatewayCollectablesController,
    UserGatewayDetailController,
    UserGatewayStatRankController,
  ],
})
export class GatewayModule {}
