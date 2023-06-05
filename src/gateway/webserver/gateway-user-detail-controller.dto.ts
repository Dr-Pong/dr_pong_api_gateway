import { Controller, Get, Param } from '@nestjs/common';
import axios from 'axios';
import { UserDetailResponseDto } from './dtos/user-detail-response.dto';

@Controller('users')
export class GatewayUserDetailController {
  @Get('/:nickname/detail')
  async userDetailByNicknameGet(
    @Param('nickname') nickname: string,
  ): Promise<UserDetailResponseDto> {
    try {
      const response = await axios.get(
        process.env.WEBSERVER_URI + `/users/${nickname}/detail`,
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}
