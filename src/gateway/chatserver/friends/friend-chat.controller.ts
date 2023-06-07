import {
  Controller,
  Get,
  Param,
  Logger,
  UseGuards,
  Req,
  Post,
  Delete,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  Body,
} from '@nestjs/common';
import axios from 'axios';
import { AuthGuard } from '@nestjs/passport';
import { FriendListResponseDto } from '../dtos/friend-list-response.dto';
import { FriendPendingListResponseDto } from '../dtos/friend-pending-list-response.dto';
import { FriendDirectMessageChatListResponseDto } from '../dtos/friend-direct-message-chat-list-response.dto';
import { PostFriendChatRequestDto } from '../dtos/friend-post-chat-request.dto';
import { FriendDirectMessageRoomListResponseDto } from '../dtos/friend-direct-message-room-list-response.dto';
import { FriendDirectMessageNewResponseDto } from '../dtos/friend-direct-message-new-response.dto';

@Controller('users/friends')
export class GatewayFriendChatController {
  private readonly logger: Logger = new Logger(
    GatewayFriendChatController.name,
  );

  @Get('/:nickname/chats')
  @UseGuards(AuthGuard('jwt'))
  async friendChatListGet(
    @Param('nickname') nickname: string,
    @Query('count', new DefaultValuePipe(40), ParseIntPipe) count: number, // validate pipe 적용
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Req() request,
  ): Promise<FriendDirectMessageChatListResponseDto> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.get(
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
    @Body() postFriendChatRequestDto: PostFriendChatRequestDto, // validate @ 적용
    @Req() request,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.post(
        process.env.CHATSERVER_URL + `/users/friends/:${nickname}/chats`,
        {
          headers: { Authorization: accessToken },
          data: { message: postFriendChatRequestDto.message },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  // 얘는 항상 성공이여서 가드가 필요 없나 ?
  // 챗 서버에서 @GetUser 안쓰면 굳이 토큰 보내지말자
  @Get('/chatlist')
  @UseGuards(AuthGuard('jwt'))
  async friendDmListGet(
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
