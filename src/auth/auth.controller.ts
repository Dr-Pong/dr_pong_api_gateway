import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { SignUpRequestDto } from './dto/auth.signup.request.dto';
import { JwtDto } from './jwt/jwt.dto';
import { AuthGuard } from '@nestjs/passport';
import { Requestor } from './jwt/auth.requestor.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private readonly logger: Logger = new Logger(AuthController.name);

  @Post('/42')
  async fortyTwoLogin(@Body('authCode') code: string): Promise<JwtDto> {
    this.logger.log(code);
    const accessToken: string = await this.authService.getFTAccessToken(code);
    const userInfo: AuthDto = await this.authService.getFTUserInfo(accessToken);
    const jwt: string = await this.authService.createJwtFromUser(userInfo);
    this.logger.log(jwt);
    return { token: jwt };
  }

  @Post('signup')
  @UseGuards(AuthGuard('jwt')) // -> 노네임일때 통과하는 가드 하나 만들어야함 (jwt-noname)
  async signUp(
    @Body() body: SignUpRequestDto,
    @Requestor() requestor: AuthDto,
  ) {
    const userId: number = requestor.id;
    await this.authService.signUp({
      userId,
      nickname: body.nickname,
      imageId: body.imgId,
    });
    // 각 서버별로 쏴주는거 requestor 객체 자체
    this.authService.requestStoreUserInfoEachServers(requestor); // 여기에 await 를 붙여야하나?
  }
}
