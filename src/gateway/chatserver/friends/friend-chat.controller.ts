import {
  Controller,
  Get,
  Param,
  Logger,
  UseGuards,
  Req,
  Post,
  Delete,
  Query,
  Body,
} from '@nestjs/common';
import axios from 'axios';
import { AuthGuard } from '@nestjs/passport';
import { FriendDirectMessageChatListResponseDto } from '../dtos/friend-direct-message-chat-list-response.dto';
import { PostFriendChatRequestDto } from '../dtos/friend-post-chat-request.dto';
import { FriendDirectMessageRoomListResponseDto } from '../dtos/friend-direct-message-room-list-response.dto';
import { FriendDirectMessageNewResponseDto } from '../dtos/friend-direct-message-new-response.dto';
import { QueryValidatePipe } from 'src/gateway/validation/custom-query-validate-pipe';

@Controller('/users/friends')
export class GatewayFriendChatController {
  private readonly logger: Logger = new Logger(
    GatewayFriendChatController.name,
  );

  @Get('/:nickname/chats')
  @UseGuards(AuthGuard('jwt'))
  async friendChatListGet(
    @Param('nickname') nickname: string,
    @Query('count', new QueryValidatePipe(40, 200)) count: number,
    @Query('offset', new QueryValidatePipe(21474836)) offset: number,
    @Req() request,
  ): Promise<FriendDirectMessageChatListResponseDto> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.get(
        process.env.CHATSERVER_URL +
          `/users/friends/${nickname}/chats?count=${count}&offset=${offset}`,
        {
          headers: { Authorization: accessToken },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  @Post('/:nickname/chats')
  @UseGuards(AuthGuard('jwt'))
  async friendChatPost(
    @Param('nickname') nickname: string,
    @Body() postFriendChatRequestDto: PostFriendChatRequestDto,
    @Req() request,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.post(
        process.env.CHATSERVER_URL + `/users/friends/${nickname}/chats`,
        { message: postFriendChatRequestDto.message },
        {
          headers: { Authorization: accessToken },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  @Get('/chatlist')
  @UseGuards(AuthGuard('jwt'))
  async friendDirectMessageListGet(
    @Req() request,
  ): Promise<FriendDirectMessageRoomListResponseDto> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.get(
        process.env.CHATSERVER_URL + `/users/friends/chatlist`,
        {
          headers: { Authorization: accessToken },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  @Delete('/chats/:nickname')
  @UseGuards(AuthGuard('jwt'))
  async friendDirectMessageDelete(
    @Param('nickname') nickname: string,
    @Req() request,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.delete(
        process.env.CHATSERVER_URL + `/users/friends/chats/${nickname}`,
        {
          headers: { Authorization: accessToken },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  @Get('/chats/new')
  @UseGuards(AuthGuard('jwt'))
  async friendDirectMessageNewGet(
    @Req() request,
  ): Promise<FriendDirectMessageNewResponseDto> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.get(
        process.env.CHATSERVER_URL + `/users/friends/chats/new`,
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
