import { Controller, Get, Query } from '@nestjs/common';
import axios from 'axios';
import { UserDetailResponseDto } from './dtos/user-detail-response.dto';
import { QueryValidatePipe } from 'src/validation/custom-query-validate-pipe';

@Controller('ranks')
export class GatewayRankController {
  @Get('/top')
  async rankTopGet(
    @Query('count', new QueryValidatePipe(3, 10)) count: number,
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
    @Query('count', new QueryValidatePipe(197, 300)) count: number,
    @Query('offset', new QueryValidatePipe(4, 300)) offset: number,
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
