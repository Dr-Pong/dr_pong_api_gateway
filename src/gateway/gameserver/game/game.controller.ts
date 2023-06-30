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
import { GameMode, GameType } from './type.game';
import { GameInviteAcceptDto } from './dto/game-invite-accept.dto';

@Controller('/games')
export class GatewayGameController {
  private readonly logger: Logger = new Logger(GatewayGameController.name);

  @Post('/invitation/:nickname')
  @UseGuards(AuthGuard('jwt'))
  async gameInvitePost(
    @Req() request,
    @Param('nickname') nickname: string,
    @Body('mode') mode: GameMode,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.post(
        process.env.GAMESERVER_URL + `/games/invitation/${nickname}`,
        mode,
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

  @Delete('/invitation')
  @UseGuards(AuthGuard('jwt'))
  async gameInviteDelete(@Req() request): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.delete(
        process.env.GAMESERVER_URL + `/games/invitation`,
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

  @Patch('/invitation/:id')
  @UseGuards(AuthGuard('jwt'))
  async gameInviteAcceptPost(
    @Req() request,
    @Param('id') id: string,
  ): Promise<GameInviteAcceptDto> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.patch(
        process.env.GAMESERVER_URL + `/games/invitation/${id}`,
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

  @Delete('/invitation/:id')
  @UseGuards(AuthGuard('jwt'))
  async gameInviteRejectDelete(
    @Req() request,
    @Param('id') id: string,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.delete(
        process.env.GAMESERVER_URL + `/games/invitation/${id}`,
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

  @Post('/queue/:type/:mode')
  @UseGuards(AuthGuard('jwt'))
  async gameQueuePost(
    @Req() request,
    @Param('type') type: GameType,
    @Body('mode') mode: GameMode,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.post(
        process.env.GAMESERVER_URL + `/games/queue/${type}`,
        mode,
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

  @Delete('/queue')
  @UseGuards(AuthGuard('jwt'))
  async gameQueueDelete(@Req() request): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.post(
        process.env.GAMESERVER_URL + `/games/qeueu`,
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
}
