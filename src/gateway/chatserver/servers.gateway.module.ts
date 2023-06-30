import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GatewayUserCollectablesController } from '../webserver/gateway-user-collectables.controller';
import { GatewayUserDetailController } from '../webserver/gateway-user-detail-controller.dto';
import { GatewayUserStatRankController } from '../webserver/gateway-user-stat-rank-controller';
import { GatewayUserRecordsController } from '../webserver/gateway-user-records-controller';
import { GatewayRankController } from '../webserver/gateway-rank-controller';
import { GatewayFriendRelationController } from './friends/friend-relation.controller';
import { GatewayBlockController } from './block/block.controller';
import { GatewayFriendChatController } from './friends/friend-chat.controller';
import { GatewayChannelAdminController } from './channels/admin.controller';
import { GatewayChannelNormalController } from './channels/normal.controller';
import { GateWayNotificationController } from './notification/notification.controller';
import { GatewayGameController } from '../gameserver/game/game.controller';

// webserver controllers
@Module({
  imports: [AuthModule],
  controllers: [
    GatewayUserCollectablesController,
    GatewayUserDetailController,
    GatewayUserStatRankController,
    GatewayUserRecordsController,
    GatewayRankController,
  ],
})
export class WebserverModule {}

// chatserver controllers
@Module({
  imports: [AuthModule],
  controllers: [
    GatewayFriendRelationController,
    GatewayBlockController,
    GatewayFriendChatController,
    GatewayChannelAdminController,
    GatewayChannelNormalController,
    GateWayNotificationController,
  ],
})
export class ChatserverModule {}

// gameserver controllers
@Module({
  imports: [AuthModule],
  controllers: [GatewayGameController],
})
export class GameserverModule {}
