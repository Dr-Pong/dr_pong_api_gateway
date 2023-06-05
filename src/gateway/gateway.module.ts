import { Module } from '@nestjs/common';
import { GatewayUserCollectablesController } from './webserver/gateway-user-collectables.controller';
import { GatewayUserDetailController } from './webserver/gateway-user-detail-controller.dto';
import { GatewayUserStatRankController } from './webserver/gateway-user-stat-rank-controller';
import { GatewayRankController } from './webserver/gateway-rank-controller';
import { GatewayUserRecordsController } from './webserver/gateway-user-records-controller';
@Module({
  controllers: [
    GatewayUserCollectablesController,
    GatewayUserDetailController,
    GatewayUserStatRankController,
    GatewayRankController,
    GatewayUserRecordsController,
  ],
})
export class GatewayModule {}
