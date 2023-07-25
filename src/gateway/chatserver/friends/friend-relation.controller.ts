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
import { FriendListResponseDto } from './dtos/friend-list-response.dto';
import { FriendPendingListResponseDto } from './dtos/friend-pending-list-response.dto';

@Controller('users/friends')
export class GatewayFriendRelationController {
  private readonly logger: Logger = new Logger(
    GatewayFriendRelationController.name,
  );

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  async friendListGet(@Req() request): Promise<FriendListResponseDto> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.get(
        process.env.CHATSERVER_URL + `/users/friends`,
        {
          headers: { Authorization: accessToken },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  @Post('/pendings/:nickname')
  @UseGuards(AuthGuard('jwt'))
  async friendPendingPost(
    @Param('nickname') nickname: string,
    @Req() request,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.post(
        process.env.CHATSERVER_URL + `/users/friends/pendings/${nickname}`,
        {},
        {
          headers: { Authorization: accessToken },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  @Get('/pendings')
  @UseGuards(AuthGuard('jwt'))
  async friendPendingListGet(
    @Req() request,
  ): Promise<FriendPendingListResponseDto> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.get(
        process.env.CHATSERVER_URL + `/users/friends/pendings`,
        {
          headers: { Authorization: accessToken },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  @Post('/:nickname')
  @UseGuards(AuthGuard('jwt'))
  async friendAcceptPost(
    @Param('nickname') nickname: string,
    @Req() request,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.post(
        process.env.CHATSERVER_URL + `/users/friends/${nickname}`,
        {},
        {
          headers: { Authorization: accessToken },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  @Delete('/pendings/:nickname')
  @UseGuards(AuthGuard('jwt'))
  async friendRejectDelete(
    @Param('nickname') nickname: string,
    @Req() request,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.delete(
        process.env.CHATSERVER_URL + `/users/friends/pendings/${nickname}`,
        {
          headers: { Authorization: accessToken },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  @Delete('/:nickname')
  @UseGuards(AuthGuard('jwt'))
  async friendDelete(
    @Param('nickname') nickname: string,
    @Req() request,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.delete(
        process.env.CHATSERVER_URL + `/users/friends/${nickname}`,
        {
          headers: { Authorization: accessToken },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
