import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import axios from 'axios';
import { UserDetailResponseDto } from './dtos/user-detail-response.dto';
import { QueryValidatePipe } from 'src/validation/custom-query-validate-pipe';
import { UserGameRecordsResponseDto } from './dtos/user-records-response.dto';

@Controller('users')
export class GatewayUserRecordsController {
  private readonly logger: Logger = new Logger(
    GatewayUserRecordsController.name,
  );
  @Get('/:nickname/records')
  async userGameRecordsByNicknameGet(
    @Param('nickname') nickname: string,
    @Query('count', new QueryValidatePipe(10, 20)) count: number,
    @Query('lastGameId', new QueryValidatePipe(0))
    lastGameId: number,
  ): Promise<UserGameRecordsResponseDto> {
    try {
      const response = await axios.get(
        process.env.WEBSERVER_URI +
          `/users/${nickname}/records?count=${count}&lastGameId=${lastGameId}`,
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  @Get('/:nickname/records/:gameId')
  async userGameRecordDetail(
    @Param('nickname') nickname: string,
    @Param('gameId', new QueryValidatePipe(0)) gameId: number,
  ): Promise<UserDetailResponseDto> {
    try {
      const response = await axios.get(
        process.env.WEBSERVER_URI + `/users/${nickname}/records/${gameId}`,
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}
