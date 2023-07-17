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

@Controller('/games')
export class GatewayGameController {
  private readonly logger: Logger = new Logger(GatewayGameController.name);

  @Post('/queue/:type')
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
        { mode: mode },
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
      const response = await axios.delete(
        process.env.GAMESERVER_URL + `/games/queue`,
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
