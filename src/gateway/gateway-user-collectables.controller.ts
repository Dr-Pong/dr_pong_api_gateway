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
  PatchUserImageRequestDto,
  PatchUserMessageRequestDto,
  PatchUserTitleRequestDto,
} from './dtos/user-patch-input.dto';

// 요청에 헤더도 포함해서 넘기기
@Controller('/users')
export class UserGatewayCollectablesController {
  private readonly logger = new Logger(UserGatewayCollectablesController.name);

  @Get('/:nickname/achievements')
  async userAchievementByNicknameGet(
    @Param('nickname') nickname: string,
    @Query('selected', new DefaultValuePipe(false), ParseBoolPipe)
    selected: boolean,
  ): Promise<UserAchievementsResponseDto> {
    try {
      const response = await axios.get(
        process.env.WEBSERVER_URI + `/users/${nickname}/achievements`,
        { params: { selected } },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
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
        process.env.WEBSERVER_URI + `/users/${nickname}/emojis`,
        { params: { selected } },
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  @Get('/:nickname/titles')
  async usersTitlesByNicknameGet(
    @Param('nickname') nickname: string,
  ): Promise<UserTitlesResponseDto> {
    try {
      const response = await axios.get(
        process.env.WEBSERVER_URI + `/users/${nickname}/titles`,
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  @Get('/images')
  async getUserImages(): Promise<ProfileImageDto> {
    try {
      const response = await axios.get(
        process.env.WEBSERVER_URI + `/users/images`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // @Get('/:nickname/records')
  // async userGameRecordsByNicknameGet(
  //   @Param('nickname') nickname: string,
  //   @Query('coount', new DefaultValuePipe(10), ParseIntPipe) count: number,
  //   @Query('lastGameId', new DefaultValuePipe(0), ParseIntPipe)
  //   lastGameId: number,
  // ): Promise<UserGameRecordsResponseDto> {}

  // Patch
  @UseGuards(AuthGuard('jwt'))
  @Patch('/:nickname/title')
  async usersDetailByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() PatchRequestDto: PatchUserTitleRequestDto,
  ): Promise<void> {
    try {
      await axios.patch(
        process.env.WEBSERVER_URI + `/users/${nickname}/title`,
        {
          data: { id: PatchRequestDto.id },
        },
      );
    } catch (error) {
      throw error.response.data;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:nickname/image')
  async usersImageByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() PatchRequestDto: PatchUserImageRequestDto,
  ): Promise<void> {
    try {
      await axios.patch(process.env.WEBSERVER_URI + `/${nickname}/image`, {
        data: { id: PatchRequestDto.id },
      });
    } catch (error) {
      throw error.response.data;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:nickname/message')
  async usersMessageByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() PatchRequestDto: PatchUserMessageRequestDto,
  ): Promise<void> {
    try {
      await axios.patch(process.env.WEBSERVER_URI + `/${nickname}/message`, {
        data: { message: PatchRequestDto.message },
      });
    } catch (error) {
      throw error.response.data;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:nickname/achievements')
  async userAchievementsByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() PatchRequestDto: PatchUserAchievementsRequestDto,
  ): Promise<void> {
    try {
      await axios.patch(
        process.env.WEBSERVER_URI + `/${nickname}/achievements`,
        {
          data: { ids: PatchRequestDto.ids },
        },
      );
    } catch (error) {
      throw error.response.data;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:nickname/emojis')
  async userEmojisByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() PatchRequestDto: PatchUserEmojisRequestDto,
  ): Promise<void> {
    try {
      await axios.patch(process.env.WEBSERVER_URI + `/${nickname}/emojis`, {
        data: { ids: PatchRequestDto.ids },
      });
    } catch (error) {
      throw error.response.data;
    }
  }
}
