import {
  Controller,
  Param,
  Logger,
  UseGuards,
  Req,
  Post,
  Delete,
  Patch,
  Body,
} from '@nestjs/common';
import axios from 'axios';
import { AuthGuard } from '@nestjs/passport';
import { ChannelPatchRequestDto } from './dtos/channel-patch-request.dto';

@Controller('/channels')
export class GatewayChannelAdminController {
  private readonly logger: Logger = new Logger(
    GatewayChannelAdminController.name,
  );

  @Patch('/:roomId')
  @UseGuards(AuthGuard('jwt'))
  async channelPatch(
    @Req() request,
    @Param('roomId') channelId: string,
    @Body() requestDto: ChannelPatchRequestDto,
  ): Promise<void> {
    try {
      const accessToken: string = request.headers.authorization;
      console.log(accessToken);
      const response = await axios.patch(
        process.env.CHATSERVER_URL + `/channels/${channelId}`,
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

  @Delete('/:roomId')
  @UseGuards(AuthGuard('jwt'))
  async channelDelete(
    @Req() request,
    @Param('roomId') channelId: string,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.delete(
        process.env.CHATSERVER_URL + `/channels/${channelId}`,
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

  @Post('/:roomId/admin/:nickname')
  @UseGuards(AuthGuard('jwt'))
  async channelAdminPost(
    @Req() request,
    @Param('roomId') channelId: string,
    @Param('nickname') nickname: string,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.post(
        process.env.CHATSERVER_URL + `/channels/${channelId}/admin/${nickname}`,
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

  @Delete('/:roomId/admin/:nickname')
  @UseGuards(AuthGuard('jwt'))
  async channelAdminDelete(
    @Req() request,
    @Param('roomId') channelId: string,
    @Param('nickname') nickname: string,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.delete(
        process.env.CHATSERVER_URL + `/channels/${channelId}/admin/${nickname}`,
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

  @Post('/:roomId/ban/:nickname')
  @UseGuards(AuthGuard('jwt'))
  async channelBanPost(
    @Req() request,
    @Param('roomId') channelId: string,
    @Param('nickname') nickname: string,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.post(
        process.env.CHATSERVER_URL + `/channels/${channelId}/ban/${nickname}`,
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

  @Delete('/:roomId/kick/:nickname')
  @UseGuards(AuthGuard('jwt'))
  async channelKickDelete(
    @Req() request,
    @Param('roomId') channelId: string,
    @Param('nickname') nickname: string,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.delete(
        process.env.CHATSERVER_URL + `/channels/${channelId}/kick/${nickname}`,
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

  @Post('/:roomId/mute/:nickname')
  @UseGuards(AuthGuard('jwt'))
  async channelMutePost(
    @Req() request,
    @Param('roomId') channelId: string,
    @Param('nickname') nickname: string,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.post(
        process.env.CHATSERVER_URL + `/channels/${channelId}/mute/${nickname}`,
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

  @Delete('/:roomId/mute/:nickname')
  @UseGuards(AuthGuard('jwt'))
  async channelMuteDelete(
    @Req() request,
    @Param('roomId') channelId: string,
    @Param('nickname') nickname: string,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      const response = await axios.delete(
        process.env.CHATSERVER_URL + `/channels/${channelId}/mute/${nickname}`,
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
