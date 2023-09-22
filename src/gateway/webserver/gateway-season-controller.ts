import { Controller, Get } from '@nestjs/common';
import axios from 'axios';

@Controller('seasons')
export class GatewaySeasonController {
  @Get('/current')
  async currentSeasonGet(): Promise<any> {
    try {
      const response = await axios.get(
        process.env.WEBSERVER_URL + `/seasons/current`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
