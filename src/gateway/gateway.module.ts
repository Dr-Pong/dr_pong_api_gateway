import { Module } from '@nestjs/common';
import { UserGatewayCollectablesController } from './gateway-user-collectables.controller';
import { UserGatewayDetailController } from './gateway-user-detail-controller.dto';
import { UserGatewayStatRankController } from './gateway-user-stat-rank-controller';
import { RankController } from './webserver/gateway-rank-controller';
@Module({
  controllers: [
    UserGatewayCollectablesController,
    UserGatewayDetailController,
    UserGatewayStatRankController,
    RankController,
  ],
})
export class GatewayModule {}
