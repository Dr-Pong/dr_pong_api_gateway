import { Controller, Get, Query } from '@nestjs/common';
import axios from 'axios';
import { UserDetailResponseDto } from './dtos/user-detail-response.dto';
import { RankQueryValidatePipe } from 'src/validation/custom-rank-query-validate-pipe';

@Controller('ranks')
export class GatewayRankController {
  @Get('/top')
  async rankTopGet(
    @Query('count', new RankQueryValidatePipe(10, 3)) count: number,
  ): Promise<UserDetailResponseDto> {
    try {
      const response = await axios.get(
        process.env.WEBSERVER_URI + `/ranks/top?count=${count}`,
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  @Get('/bottom')
  async rankBottomGet(
    @Query('count', new RankQueryValidatePipe(300, 197)) count: number,
    @Query('offset', new RankQueryValidatePipe(300, 4)) offset: number,
  ): Promise<UserDetailResponseDto> {
    try {
      const response = await axios.get(
        process.env.WEBSERVER_URI +
          `/ranks/bottom?count=${count}&offset=${offset}`,
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}
