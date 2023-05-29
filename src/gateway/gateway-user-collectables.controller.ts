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
  UseGuards,
  UnauthorizedException,
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
  // TODO: Patch 인풋에도 Dto 로 Clgass validator 로 검증하기 -> 다를시 400 BadRequest 에러
  @UseGuards(AuthGuard('jwt'))
  @Patch('/:nickname/title')
  async usersDetailByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() PatchRequestDto: PatchUserTitleRequestDto, // DTO 로 받기
  ): Promise<void> {
    try {
      await axios.patch(
        process.env.WEBSERVER_URI + `/users/${nickname}/title`,
        {
          data: {
            id: PatchRequestDto.id,
          },
        },
      );
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(error.response.data.message);
      } else throw error;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:nickname/image')
  async usersImageByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() PatchRequestDto: PatchUserImageRequestDto, // DTO 로 받기
  ): Promise<void> {
    try {
      await axios.patch(process.env.WEBSERVER_URI + '/${nickname}/image', {
        params: nickname,
        data: {
          id: PatchRequestDto.id,
        },
      });
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(error.response.data.message);
      } else throw error;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:nickname/message')
  async usersMessageByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() PatchRequestDto: PatchUserMessageRequestDto, // DTO 로 받기
  ): Promise<void> {
    try {
      await axios.patch(process.env.WEBSERVER_URI + '/${nickname}/message', {
        params: nickname,
        data: {
          message: PatchRequestDto.message,
        },
      });
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(error.response.data.message);
      } else throw error;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:nickname/achievements')
  async userAchievementsByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() PatchRequestDto: PatchUserAchievementsRequestDto, // DTO로 받기
  ): Promise<void> {
    try {
      await axios.patch(
        process.env.WEBSERVER_URI + '/${nickname}/achievements',
        {
          params: nickname,
          data: PatchRequestDto.ids,
        },
      );
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(error.response.data.message);
      } else throw error;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:nickname/emojis')
  async userEmojisByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() PatchRequestDto: PatchUserEmojisRequestDto, // DTO 로 받기
  ): Promise<void> {
    try {
      await axios.patch(process.env.WEBSERVER_URI + `/${nickname}/emojis`, {
        data: PatchRequestDto.ids,
      });
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(error.response.data.message);
      } else if (error.response?.status === 401) {
        throw new UnauthorizedException(error.response.data.message);
      } else throw error;
    }
  }
}
