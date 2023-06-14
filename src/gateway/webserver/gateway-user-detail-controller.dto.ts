import { Controller, Get, Param, Req } from '@nestjs/common';
import axios from 'axios';
import { UserDetailResponseDto } from './dtos/user-detail-response.dto';
import { AuthService } from 'src/auth/auth.service';
import { GetUserMeDto } from 'src/auth/dto/get.user.me.dto';

@Controller('users')
export class GatewayUserDetailController {
  constructor(private readonly authService: AuthService) {}
  @Get('/:nickname/detail')
  async userDetailByNicknameGet(
    @Param('nickname') nickname: string,
  ): Promise<UserDetailResponseDto> {
    try {
      const response = await axios.get(
        process.env.WEBSERVER_URL + `/users/${nickname}/detail`,
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
  @Get('/me')
  async getUserMeDetail(@Req() request) {
    const btoken: string = request.headers.authorization;
    const token = btoken?.split(' ')[1];
    return await this.authService.getUserMe({ token });
  }
}
