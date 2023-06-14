import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { SignUpRequestDto } from './dto/auth.signup.request.dto';
import { JwtDto } from './jwt/jwt.dto';
import { TokenInterface } from './jwt/jwt.token.interface';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}
  private readonly logger: Logger = new Logger(AuthController.name);

  @Post('/42')
  async fortyTwoLogin(@Body('authCode') code: string): Promise<JwtDto> {
    this.logger.log(code);
    const accessToken: string = await this.authService.getFTAccessToken(code);
    const userInfo: AuthDto = await this.authService.getFTUserInfo(accessToken);
    const jwt: string = await this.authService.createJwtFromUser(userInfo);
    this.logger.log(jwt);
    return { accessToken: jwt };
  }

  //TODO: 가드 써서 불필요한 행위 없애기
  @Post('/signup')
  async signUp(@Body() body: SignUpRequestDto, @Req() req): Promise<JwtDto> {
    const token: string = req.headers.authorization?.split(' ')[1];
    const user: TokenInterface = await this.jwtService.verify(token);
    const userId: number = user.id;
    const signedUser: AuthDto = await this.authService.signUp({
      userId,
      nickname: body.nickname,
      imageId: body.imgId,
    });
    const accessToken = await this.authService.createJwtFromUser(signedUser);

    return { accessToken: accessToken };
  }
}
