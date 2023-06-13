import {
  Controller,
  Param,
  Logger,
  UseGuards,
  Req,
  Post,
  Delete,
  Body,
  Get,
  Query,
} from '@nestjs/common';
import axios from 'axios';
import { AuthGuard } from '@nestjs/passport';
import { ChannelPageResponseDto } from './dtos/channel-page-response.dto';
import { ChannelParticipantsResponseDto } from './dtos/channel-participant.dto';
import { PostChannelRequestDto } from './dtos/post-channel-request.dto';
import { PostChannelJoinRequestDto } from './dtos/post-channel-join-request.dto';
import { PostChannelChatRequestDto } from './dtos/post-channel-chat-request.dto';
import { ChannelMeResponseDto } from './dtos/channel-me-response.dto';
import { ChannelChatsResponseDto } from './dtos/channel-chat-response.dto';

@Controller('/channels')
export class GatewayChannelAdminController {
  private readonly logger: Logger = new Logger(
    GatewayChannelAdminController.name,
  );

  @Get('/')
  async channelPageGet(
    @Query('page') page: number,
    @Query('count') count: number,
    @Query('order') orderBy: 'resent' | 'popular',
    @Query('keyword') keyword: string,
  ): Promise<ChannelPageResponseDto> {
    try {
      const response = await axios.get(
        process.env.CHATSERVER_URL +
          `/channels?page=${page}&count=${count}&order=${orderBy}&keyword=${keyword}`,
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  @Get('/:roomId/participants')
  @UseGuards(AuthGuard('jwt'))
  async channelParticipantsGet(
    @Req() request,
    @Query('roomId') channelId: string,
  ): Promise<ChannelParticipantsResponseDto> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.get(
        process.env.CHATSERVER_URL + `/channels/${channelId}/participants`,
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  async channelPost(
    @Req() request,
    @Body() requestDto: PostChannelRequestDto,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.post(
        process.env.CHATSERVER_URL + `/channels`,
        { requestDto }, // 볏겨서?
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  @Post('/:roomId/participants')
  @UseGuards(AuthGuard('jwt'))
  async channelParticipantPost(
    @Req() request,
    @Param('roomId') channelId: string,
    @Body() requestDto: PostChannelJoinRequestDto,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.post(
        process.env.CHATSERVER_URL + `/channels/${channelId}/participants`,
        { requestDto },
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  @Delete('/:roomId/participants')
  @UseGuards(AuthGuard('jwt'))
  async channelParticipantDelete(
    @Req() request,
    @Param('roomId') channelId: string,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.delete(
        process.env.CHATSERVER_URL + `/channels/${channelId}/participants`,
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  @Post('/:roomId/invitation/:nickname')
  @UseGuards(AuthGuard('jwt'))
  async channelInvitationPost(
    @Req() request,
    @Param('roomId') channelId: string,
    @Param('nickname') nickname: string,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.post(
        process.env.CHATSERVER_URL +
          `/channels/${channelId}/invitation/${nickname}`,
        {},
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  @Post('/:roomId/magicpass')
  @UseGuards(AuthGuard('jwt'))
  async channelMagicPassPost(
    @Req() request,
    @Param('roomId') channelId: string,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.post(
        process.env.CHATSERVER_URL + `/channels/${channelId}/magicpass`,
        {},
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  @Post('/:roomId/chats')
  @UseGuards(AuthGuard('jwt'))
  async channelChatPost(
    @Req() request,
    @Param('roomId') channelId: string,
    @Body() requestDto: PostChannelChatRequestDto,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.post(
        process.env.CHATSERVER_URL + `/channels/${channelId}/chat`,
        requestDto,
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async channelMeGet(@Req() request): Promise<ChannelMeResponseDto> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.get(
        process.env.CHATSERVER_URL + `/channels/me`,
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  @Get('/:roomId/chats')
  @UseGuards(AuthGuard('jwt'))
  async channelChatsGet(
    @Req() request,
    @Param('roomId') channelId: string,
    @Query('offset') offset: number,
    @Query('count') count: number,
  ): Promise<ChannelChatsResponseDto> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.get(
        process.env.CHATSERVER_URL +
          `/channels/${channelId}/chats?offset=${offset}&count=${count}`,
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}