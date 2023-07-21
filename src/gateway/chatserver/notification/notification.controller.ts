import {
  Controller,
  Logger,
  UseGuards,
  Req,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import axios from 'axios';
import { AuthGuard } from '@nestjs/passport';
import { FriendRequestCountResponseDto } from './dtos/friend-request-count-response.dto';
import ChannelInviteListResponseDto from './dtos/channel-invite-list-response.dto';
import { NotificationResponseDto } from './dtos/notification-response.dto';

@Controller('/users/notifications')
export class GateWayNotificationController {
  private readonly logger: Logger = new Logger(
    GateWayNotificationController.name,
  );

  @Get('/friends')
  @UseGuards(AuthGuard('jwt'))
  async friendRequestCountGet(
    @Req() request,
  ): Promise<FriendRequestCountResponseDto> {
    try {
      const accessToken: string = request.headers.authorization;
      const response = await axios.get(
        process.env.CHATSERVER_URL + `/users/notifications/friends`,
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  @Get('/channels')
  @UseGuards(AuthGuard('jwt'))
  async channelInviteListGet(
    @Req() request,
  ): Promise<ChannelInviteListResponseDto> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.get(
        process.env.CHATSERVER_URL + `/users/notifications/channels`,
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  @Delete('/channels/:id')
  @UseGuards(AuthGuard('jwt'))
  async channelInvitationDelete(
    @Req() request,
    @Param('id') id: string,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.delete(
        process.env.CHATSERVER_URL + `/users/notifications/channels/${id}`,
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  @Get('/games')
  @UseGuards(AuthGuard('jwt'))
  async GameNotificationsGet(@Req() request): Promise<NotificationResponseDto> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.get(
        process.env.CHATSERVER_URL + `/users/notifications/games`,
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
