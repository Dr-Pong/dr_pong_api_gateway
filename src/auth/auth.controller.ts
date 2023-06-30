import {
  Body,
  Controller,
  Delete,
  Logger,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { SignUpRequestDto } from './dto/auth.signup.request.dto';
import { JwtDto } from './jwt/jwt.dto';
import { AuthGuard } from '@nestjs/passport';
import { Requestor } from './jwt/auth.requestor.decorator';
import { UserIdCardDto } from './jwt/auth.user.id-card.dto';
import { UserRepository } from 'src/user/user.repository';
import { ROLETYPE_MEMBER } from 'src/user/type.user.roletype';
import { User } from 'src/user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userRepository: UserRepository,
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

  // 2fa
  // 최초 등록할때 켜고 2fa user true로 바꿔주고
  /**
POST /auth/tfa
request body: {
}
response body: {
	redirectionUrl: string;
	qrCode: string;
	secretKey: string;
}
response header: {
	201: created;
	401: unauthorized; // no token
}
```
   */
  @Post('/tfa')
  @UseGuards(AuthGuard('jwt'))
  async registerOtp(@Requestor() requestor: UserIdCardDto) {
    const userId: number = requestor.id;
    const { secretKey, url, qrCode } = await this.authService.generateOtp(
      userId,
    );
    const redirectionUrl = url;
    this.authService.checkOtpApplied(userId, secretKey);
    return { redirectionUrl, secretKey, qrCode };
  }

  // 2fa 입력 값이 우리가 가지고 있는 값과 일치하는지 확인 하는
  /**
  * POST /auth/tfa/otp
request body: {
	password: string; 
}
response header: {
	200: OK;
	40~:
}
response body: {
	accessToken: string;
}
  */
  @Post('/tfa/otp')
  @UseGuards(AuthGuard('jwt'))
  async verifyOtp(
    @Requestor() requestor: UserIdCardDto,
    @Body('password') password: string,
  ) {
    const userId: number = requestor.id;
    const isValid: boolean = await this.authService.verifyOtp(userId, password);
    if (!isValid) throw new UnauthorizedException();
    const user = await this.userRepository.findById(userId);
    const authDto: AuthDto = new AuthDto(
      user.id,
      user.nickname,
      user.secondAuthSecret ? true : false,
      ROLETYPE_MEMBER,
    );
    const accessToken: string = await this.authService.createJwtFromUser(
      authDto,
    );
    return { accessToken };
  }

  // 2차인증 끄는 요청
  /**
   * DELETE /auth/tfa
response body: {
}
response header: {
	200: OK!
	401: unauthorized; // no token
}
   */
  @Delete('/tfa')
  @UseGuards(AuthGuard('jwt'))
  async turnOffOtp(@Requestor() requestor: UserIdCardDto) {
    const userId: number = requestor.id;
    const user: User = await this.userRepository.findById(userId);
    await this.userRepository.updateSecondAuth(user, null);
  }
}
