import { Controller, Get, Param } from '@nestjs/common';
import axios from 'axios';

@Controller('/users')
export class UserGatewayController {
  @Get('/:nickname/detail')
  async userDetailByNicknameGet(@Param('nickname') nickname: string) {
    return (
      await axios.get(process.env.WEBSERVER_URI + '/${nickname}/detail', {
        params: nickname,
      })
    ).data;
  }

  @Get('/me')
  @Get('/:nickname/achievements')
  async userAchievementByNicknameGet(
    @Param('nickname') nickname: string,
    @Query('selected', new DefaultValuePipe(false), ParseBoolPipe)
    selected: boolean,
  ): Promise<UserAchievementsResponseDto> {}

  @Get('/:nickname/emojis')
  async userEmojisByNicknameGet(
    @Param('nickname') nickname: string,
    @Query('selected', new DefaultValuePipe(false), ParseBoolPipe)
    selected: boolean,
  ): Promise<UserEmojisResponseDto> {}

  @Get('/:nickname/titles')
  async usersTitlesByNicknameGet(
    @Param('nickname') nickname: string,
  ): Promise<UserTitlesResponseDto> {}

  @Get('/:nickname/ranks/total')
  async userTotalRankByNicknameGet(
    @Param('nickname') nickname: string,
  ): Promise<UserTotalRankResponseDto> {}

  @Get('/:nickname/ranks/season')
  async userSeasonRankByNicknameGet(
    @Param('nickname') nickname: string,
  ): Promise<UserSeasonRankResponseDto> {}

  @Get('/:nickname/stats/total')
  async userTotalStatByNicknameGet(
    @Param('nickname') nickname: string,
  ): Promise<UserGameTotalStatResponseDto> {}

  @Get('/:nickname/stats/season')
  async userSeasonStatByNicknameGet(
    @Param('nickname') nickname: string,
  ): Promise<UserGameSeasonStatResponseDto> {}

  @Get('/:nickname/records')
  async userGameRecordsByNicknameGet(
    @Param('nickname') nickname: string,
    @Query('coount', new DefaultValuePipe(10), ParseIntPipe) count: number,
    @Query('lastGameId', new DefaultValuePipe(0), ParseIntPipe)
    lastGameId: number,
  ): Promise<UserGameRecordsResponseDto> {}

  @Patch('/:nickname/title')
  async usersDetailByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() body,
  ): Promise<void> {}

  @Patch('/:nickname/image')
  async usersImageByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() body,
  ): Promise<void> {}

  @Patch('/:nickname/message')
  async usersMessageByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() body,
  ): Promise<void> {}

  @Patch('/:nickname/achievements')
  async userAchievementsByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() body,
  ): Promise<void> {}

  @Patch('/:nickname/emojis')
  async userEmojisByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() body,
  ): Promise<void> {}
}
