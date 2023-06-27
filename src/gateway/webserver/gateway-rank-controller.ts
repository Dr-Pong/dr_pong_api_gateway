import { Controller, Get, Inject, Logger, Query } from '@nestjs/common';
import axios from 'axios';
import { QueryValidatePipe } from 'src/gateway/validation/custom-query-validate-pipe';
import { RanksBottomResponseDto } from './dtos/user-rank-bottom-respose.dto';
import { RanksTopReponseDto } from './dtos/user-rank-response.dto';

@Controller('ranks')
export class GatewayRankController {
  private readonly logger: Logger = new Logger(GatewayRankController.name);
  @Get('/top')
  async rankTopGet(
    @Query('count', new QueryValidatePipe(3, 10)) count: number,
  ): Promise<RanksTopReponseDto> {
    try {
      const response = await axios.get(
        process.env.WEBSERVER_URL + `/ranks/top?count=${count}`,
      );
      return response.data;
    } catch (error) {
      throw error.response?.data;
    }
  }

  @Get('/bottom')
  async rankBottomGet(
    @Query('count', new QueryValidatePipe(197, 300)) count: number,
    @Query('offset', new QueryValidatePipe(4, 300)) offset: number,
  ): Promise<RanksBottomResponseDto> {
    try {
      const response = await axios.get(
        process.env.WEBSERVER_URL +
          `/ranks/bottom?count=${count}&offset=${offset}`,
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}
