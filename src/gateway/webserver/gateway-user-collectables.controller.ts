import {
  Controller,
  Get,
  Param,
  Query,
  DefaultValuePipe,
  Body,
  Patch,
  ParseBoolPipe,
  Logger,
  UseGuards,
  Req,
} from '@nestjs/common';
import axios from 'axios';
import { UserAchievementsResponseDto } from './dtos/user-achievements-response.dto';
import { UserEmojisResponseDto } from './dtos/user-emoji-response.dto';
import { UserTitlesResponseDto } from './dtos/user-titles-response.dto';
import { ProfileImageDto } from './dtos/user-images-response.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  PatchUserAchievementsRequestDto,
  PatchUserEmojisRequestDto,
  PatchUserMessageRequestDto,
  PatchUserTitleRequestDto,
} from './dtos/user-patch-input.dto';
import { UserRelationResponseDto } from './dtos/user-relation.response.dto';

@Controller('/users')
export class GatewayUserCollectablesController {
  private readonly logger: Logger = new Logger(
    GatewayUserCollectablesController.name,
  );

  @Get('/:nickname/achievements')
  async userAchievementByNicknameGet(
    @Param('nickname') nickname: string,
    @Query('selected', new DefaultValuePipe(false), ParseBoolPipe)
    selected: boolean,
  ): Promise<UserAchievementsResponseDto> {
    try {
      const response = await axios.get(
        process.env.WEBSERVER_URL +
          `/users/${nickname}/achievements?selected=${selected}`,
      );
      return response?.data;
    } catch (error) {
      throw error;
    }
  }

  @Get('/:nickname/emojis')
  async userEmojisByNicknameGet(
    @Param('nickname') nickname: string,
    @Query('selected', new DefaultValuePipe(false), ParseBoolPipe)
    selected: boolean,
  ): Promise<UserEmojisResponseDto> {
    try {
      const response = await axios.get(
        process.env.WEBSERVER_URL +
          `/users/${nickname}/emojis?selected=${selected}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  @Get('/:nickname/titles')
  async usersTitlesByNicknameGet(
    @Param('nickname') nickname: string,
  ): Promise<UserTitlesResponseDto> {
    try {
      const response = await axios.get(
        process.env.WEBSERVER_URL + `/users/${nickname}/titles`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  @Get('/images')
  async getUserImages(): Promise<ProfileImageDto> {
    try {
      const response = await axios.get(
        process.env.WEBSERVER_URL + `/users/images`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Patch
  @UseGuards(AuthGuard('jwt'))
  @Patch('/:nickname/title')
  async usersDetailByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() PatchRequestDto: PatchUserTitleRequestDto,
    @Req() request,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;
      await axios.patch(
        process.env.WEBSERVER_URL + `/users/${nickname}/title`,
        { id: PatchRequestDto.id },
        {
          headers: { Authorization: accessToken },
        },
      );
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:nickname/message')
  async usersMessageByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() PatchRequestDto: PatchUserMessageRequestDto,
    @Req() request,
  ): Promise<void> {
    try {
      const accessToken = request.headers.authorization;

      await axios.patch(
        process.env.WEBSERVER_URL + `/users/${nickname}/message`,
        { message: PatchRequestDto.message },
        {
          headers: { Authorization: accessToken },
        },
      );
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:nickname/achievements')
  async userAchievementsByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() PatchRequestDto: PatchUserAchievementsRequestDto,
    @Req() request,
  ): Promise<void> {
    try {
      await axios.patch(
        process.env.WEBSERVER_URL + `/users/${nickname}/achievements`,
        { ids: PatchRequestDto.ids },
        {
          headers: { Authorization: request.headers.authorization },
        },
      );
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:nickname/emojis')
  async userEmojisByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() PatchRequestDto: PatchUserEmojisRequestDto,
    @Req() request,
  ): Promise<void> {
    try {
      await axios.patch(
        process.env.WEBSERVER_URL + `/users/${nickname}/emojis`,
        { ids: PatchRequestDto.ids },
        {
          headers: { Authorization: request.headers.authorization },
        },
      );
    } catch (error) {
      throw error;
    }
  }

  @Get('/:nickname/relations/:targetnickname')
  async getUserRelationByNickname(
    @Param('nickname') nickname: string,
    @Param('targetnickname') targetnickname: string,
  ): Promise<UserRelationResponseDto> {
    try {
      const response = await axios.get(
        process.env.CHATSERVER_URL +
          `/users/${nickname}/relations/${targetnickname}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
