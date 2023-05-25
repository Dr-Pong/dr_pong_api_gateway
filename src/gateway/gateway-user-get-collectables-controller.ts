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
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { UserAchievementsResponseDto } from './dtos/user-achievements-response.dto';
import { UserEmojisResponseDto } from './dtos/user-emoji-response.dto';
import { UserTitlesResponseDto } from './dtos/user-titles-response.dto';
import { ProfileImageDto } from './dtos/user-images-response.dto';

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
      if (error.response?.status === 404) {
        throw new NotFoundException(error.response.data.message);
      } else {
        throw error;
      }
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
      if (error.response?.status === 404) {
        throw new NotFoundException(error.response.data.message);
      } else {
        throw error;
      }
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
      if (error.response?.status === 404) {
        throw new NotFoundException(error.response.data.message);
      } else {
        throw error;
      }
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
  @Patch('/:nickname/title')
  async usersDetailByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() id: number,
  ): Promise<void> {
    try {
      await axios.patch(
        process.env.WEBSERVER_URI + `/users/${nickname}/title`,
        {
          data: {
            id: id,
          },
        },
      );
    } catch (error) {}
  }

  @Patch('/:nickname/image')
  async usersImageByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() id: number,
  ): Promise<void> {
    await axios.patch(process.env.WEBSERVER_URI + '/${nickname}/image', {
      params: nickname,
      data: {
        id: id,
      },
    });
  }

  @Patch('/:nickname/message')
  async usersMessageByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body()
    message: string,
  ): Promise<void> {
    await axios.patch(process.env.WEBSERVER_URI + '/${nickname}/message', {
      params: nickname,
      data: {
        message: message,
      },
    });
  }

  @Patch('/:nickname/achievements')
  async userAchievementsByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() ids: (number | null)[],
  ): Promise<void> {
    await axios.patch(process.env.WEBSERVER_URI + '/${nickname}/achievements', {
      params: nickname,
      data: ids,
    });
  }

  @Patch('/:nickname/emojis')
  async userEmojisByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body()
    ids: (number | null)[],
  ): Promise<void> {
    await axios.patch(process.env.WEBSERVER_URI + '/${nickname}/emojis', {
      params: nickname,
      data: ids,
    });
  }
}
