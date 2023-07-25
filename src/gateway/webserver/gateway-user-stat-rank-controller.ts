import { Controller, Get, Logger, Param } from '@nestjs/common';
import axios from 'axios';
import { UserGameTotalStatResponseDto } from './dtos/user-game-total-stat-response.dto';
import { UserGameSeasonStatResponseDto } from './dtos/user-game-season-stat-response.dto';
import { UserTotalRankResponseDto } from './dtos/user-total-rank-response.dto';
import { UserSeasonRankResponseDto } from './dtos/user-season-rank-response.dto';

@Controller('users')
export class GatewayUserStatRankController {
  private readonly logger: Logger = new Logger(
    GatewayUserStatRankController.name,
  );

  @Get('/:nickname/stats/total')
  async userTotalStatByNicknameGet(
    @Param('nickname') nickname: string,
  ): Promise<UserGameTotalStatResponseDto> {
    try {
      const response = await axios.get(
        process.env.WEBSERVER_URL + `/users/${nickname}/stats/total`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  @Get('/:nickname/stats/season')
  async userSeasonStatByNicknameGet(
    @Param('nickname') nickname: string,
  ): Promise<UserGameSeasonStatResponseDto> {
    try {
      const response = await axios.get(
        process.env.WEBSERVER_URL + `/users/${nickname}/stats/season`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  @Get('/:nickname/ranks/total')
  async userTotalRankByNicknameGet(
    @Param('nickname') nickname: string,
  ): Promise<UserTotalRankResponseDto> {
    try {
      const response = await axios.get(
        process.env.WEBSERVER_URL + `/users/${nickname}/ranks/total`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  //** Get stat's season rank*/
  @Get('/:nickname/ranks/season')
  async userSeasonRankByNicknameGet(
    @Param('nickname') nickname: string,
  ): Promise<UserSeasonRankResponseDto> {
    try {
      const response = await axios.get(
        process.env.WEBSERVER_URL + `/users/${nickname}/ranks/season`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
