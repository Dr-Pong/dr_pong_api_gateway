import { Module } from '@nestjs/common';
import { UserGatewayCollectablesController } from './webserver/gateway-user-collectables.controller';
import { UserGatewayDetailController } from './webserver/gateway-user-detail-controller.dto';
import { UserGatewayStatRankController } from './webserver/gateway-user-stat-rank-controller';
import { GatewayRankController } from './webserver/gateway-rank-controller';
import { GatewayRecordsController } from './webserver/gateway-user-records-controller';
@Module({
  controllers: [
    UserGatewayCollectablesController,
    UserGatewayDetailController,
    UserGatewayStatRankController,
    GatewayRankController,
    GatewayRecordsController,
  ],
})
export class GatewayModule {}
