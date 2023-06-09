import { Module } from '@nestjs/common';
import { GatewayUserCollectablesController } from './webserver/gateway-user-collectables.controller';
import { GatewayUserDetailController } from './webserver/gateway-user-detail-controller.dto';
import { GatewayUserStatRankController } from './webserver/gateway-user-stat-rank-controller';
import { GatewayRankController } from './webserver/gateway-rank-controller';
import { GatewayUserRecordsController } from './webserver/gateway-user-records-controller';
import { GatewayFriendRelationController } from './chatserver/friends/friend-relation.controller';
import { GatewayBlockController } from './chatserver/block/block.controller';
import { GatewayFriendChatController } from './chatserver/friends/friend-chat.controller';
@Module({
  controllers: [
    // webserver
    GatewayUserCollectablesController,
    GatewayUserDetailController,
    GatewayUserStatRankController,
    GatewayUserRecordsController,
    GatewayRankController,
    // chatserver
    GatewayFriendRelationController,
    GatewayBlockController,
    GatewayFriendChatController,
  ],
})
export class GatewayModule {}
