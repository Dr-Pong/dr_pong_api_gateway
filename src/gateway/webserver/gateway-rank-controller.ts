import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import axios from 'axios';
import { UserDetailResponseDto } from './dtos/user-detail-response.dto';

@Controller('ranks')
export class RankController {
  @Get('/top')
  async rankTopGet(
    @Query('count', new DefaultValuePipe(197), ParseIntPipe) count: number,
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
    @Query('count', new DefaultValuePipe(197), ParseIntPipe) count: number,
    @Query('offset', new DefaultValuePipe(4), ParseIntPipe) offset: number,
  ): Promise<UserDetailResponseDto> {
    try {
      const response = await axios.get(
        process.env.WEBSERVER_URI +
          `/users/bottom?count=${count}&offset=${offset}`,
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}
