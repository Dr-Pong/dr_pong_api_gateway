import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { SignUpRequestDto } from './dto/auth.signup.request.dto';
import { JwtDto } from './jwt/jwt.dto';
import { AuthGuard } from '@nestjs/passport';
import { Requestor } from './jwt/auth.requestor.decorator';
import { UserIdCardDto } from './jwt/auth.user.id-card.dto';

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
    return { accessToken: jwt };
  }

  @Post('/signup')
  @UseGuards(AuthGuard('jwtNoname'))
  async signUp(
    @Body() body: SignUpRequestDto,
    @Requestor() requestor: UserIdCardDto,
  ): Promise<JwtDto> {
    const userId: number = requestor.id;
    const signedUser: AuthDto = await this.authService.signUp({
      userId,
      nickname: body.nickname,
      imageId: body.imgId,
    });
    const accessToken = await this.authService.createJwtFromUser(signedUser);

    return { accessToken: accessToken };
  }
}
