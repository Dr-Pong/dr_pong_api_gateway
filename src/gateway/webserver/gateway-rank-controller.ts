import { Controller, Get, Inject, Logger, Query } from '@nestjs/common';
import axios from 'axios';
import { QueryValidatePipe } from 'src/gateway/validation/custom-query-validate-pipe';
import { RanksBottomResponseDto } from './dtos/user-rank-bottom-respose.dto';
import { RanksTopReponseDto } from './dtos/user-rank-response.dto';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';

@Controller('ranks')
export class GatewayRankController {
  private readonly logger: Logger = new Logger(GatewayRankController.name);
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly webserverLogger: WinstonLogger,
  ) {}
  @Get('/top')
  async rankTopGet(
    @Query('count', new QueryValidatePipe(3, 10)) count: number,
  ): Promise<RanksTopReponseDto> {
    // this.logger.log('WEBSERVER', 'Log message');
    this.webserverLogger.log('webserver_log', 'Log message');
    try {
      const response = await axios.get(
        process.env.WEBSERVER_URL + `/ranks/top?count=${count}`,
      );
      return response.data;
    } catch (error) {
      this.webserverLogger.error(
        'webserver_error',
        JSON.stringify(error.response?.data),
      );
      this.logger.log(error.response?.data)
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
