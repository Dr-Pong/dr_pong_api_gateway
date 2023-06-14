import {
  Controller,
  Get,
  Param,
  Logger,
  UseGuards,
  Req,
  Post,
  Delete,
} from '@nestjs/common';
import axios from 'axios';
import { AuthGuard } from '@nestjs/passport';
import { BlocksUserResponseDto } from '../dtos/user-blocks-response.dto';

@Controller('/users/blocks')
export class GatewayBlockController {
  private readonly logger: Logger = new Logger(GatewayBlockController.name);

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  async userBlocksGet(@Req() request): Promise<BlocksUserResponseDto> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.get(
        process.env.CHATSERVER_URL + `/users/blocks`,
        {
          headers: { Authorization: accessToken },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  @Post('/:nickname')
  @UseGuards(AuthGuard('jwt'))
  async userBlocksPost(
    @Req() request,
    @Param('nickname') nickname: string,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.post(
        process.env.CHATSERVER_URL + `/users/blocks/${nickname}`,
        {},
        {
          headers: { Authorization: accessToken },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  @Delete('/:nickname')
  @UseGuards(AuthGuard('jwt'))
  async userBlocksDelete(
    @Req() request,
    @Param('nickname') nickname: string,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.delete(
        process.env.CHATSERVER_URL + `/users/blocks/${nickname}`,
        {
          headers: { Authorization: accessToken },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}
