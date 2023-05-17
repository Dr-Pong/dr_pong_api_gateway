import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { SignUpRequestDto } from './dto/auth.signup.request.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/42')
  async fortyTwoLogin(@Body('authCode') code: string): Promise<JwtDto> {
    console.log(code);
    const accessToken: string = await this.authService.getFTAccessToken(code);
    const userInfo: AuthDto = await this.authService.getFTUserInfo(accessToken);
    const jwt: string = await this.authService.createJwtFromUser(userInfo);
    console.log(jwt);
    return { token: jwt };
  }

  @Post('signup')
  async signUp(@Body() body: SignUpRequestDto, @Req() req) {
    const userId: number = req.user.id;
    await this.authService.signUp({
      userId,
      nickname: body.nickname,
      imageId: body.imgId,
    });
  }
}
