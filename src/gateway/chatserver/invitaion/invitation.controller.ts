import {
  Body,
  Controller,
  Delete,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import axios from 'axios';
import { GameMode } from 'src/gateway/gameserver/game/type.game';
import { GameInviteAcceptDto } from './dto/game-invite-accept.dto';

@Controller('/invitations')
export class GatewayInvitationController {
  private readonly logger: Logger = new Logger(
    GatewayInvitationController.name,
  );

  @Post('/games')
  @UseGuards(AuthGuard('jwt'))
  async gameInvitePost(
    @Req() request,
    @Param('nickname') nickname: string,
    @Body() body: { nickname: string; mode: GameMode },
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.post(
        process.env.CHATSERVER_URL + `/invitations/games`,
        body,
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

  @Delete('/games')
  @UseGuards(AuthGuard('jwt'))
  async gameInviteDelete(@Req() request): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.delete(
        process.env.CHATSERVER_URL + `/invitations/games`,
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

  @Patch('/games/:id')
  @UseGuards(AuthGuard('jwt'))
  async gameInviteAcceptPost(
    @Req() request,
    @Param('id') id: string,
  ): Promise<GameInviteAcceptDto> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.patch(
        process.env.CHATSERVER_URL + `/invitations/games/${id}`,
        {},
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

  @Delete('/games/:id')
  @UseGuards(AuthGuard('jwt'))
  async gameInviteRejectDelete(
    @Req() request,
    @Param('id') id: string,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.delete(
        process.env.CHATSERVER_URL + `/invitations/games/${id}`,
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

  @Post('/channels/:roomId')
  @UseGuards(AuthGuard('jwt'))
  async channelInvitationPost(
    @Req() request,
    @Param('roomId') channelId: string,
    @Body('nickname') nickname: string,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.post(
        process.env.CHATSERVER_URL + `/invitations/channels/${channelId}`,
        { nickname: nickname },
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

  @Patch('/channels/:roomId')
  @UseGuards(AuthGuard('jwt'))
  async channelInvitationPatch(
    @Req() request,
    @Param('roomId') channelId: string,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.patch(
        process.env.CHATSERVER_URL + `/invitations/channels/${channelId}`,
        {},
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

  @Delete('/channels/:roomId')
  @UseGuards(AuthGuard('jwt'))
  async channelInvitationDelete(
    @Req() request,
    @Param('roomId') channelId: string,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.delete(
        process.env.CHATSERVER_URL + `/invitations/channels/${channelId}`,
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
