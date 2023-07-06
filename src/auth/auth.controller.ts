import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Post,
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
import { generateOtpDto } from './dto/auth.generateOtp.response.dto';

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

    return new JwtDto(accessToken);
  }

  @Get('/tfa')
  @UseGuards(AuthGuard('jwt'))
  async registerOtp(
    @Requestor() requestor: UserIdCardDto,
  ): Promise<generateOtpDto> {
    const userId: number = requestor.id;
    const responseDto = new generateOtpDto(
      await this.authService.generateOtp(userId),
    );
    return responseDto;
  }

  @Post('/tfa/otp')
  @UseGuards(AuthGuard('jwt'))
  async checkVerifyOtp(
    @Requestor() requestor: UserIdCardDto,
    @Body('password') password: string,
  ): Promise<JwtDto> {
    const userId: number = requestor.id;
    await this.authService.verifyOtp(userId, password);
    const user = await this.userRepository.findById(userId);
    const authDto: AuthDto = new AuthDto(
      user.id,
      user.nickname,
      false,
      ROLETYPE_MEMBER,
    );
    const accessToken: string = await this.authService.createJwtFromUser(
      authDto,
    );
    return new JwtDto(accessToken);
  }

  @Post('/tfa')
  @UseGuards(AuthGuard('jwt'))
  async verifyOtpFirst(
    @Requestor() requestor: UserIdCardDto,
    @Body('password') password: string,
  ) {
    const userId: number = requestor.id;
    const user = await this.userRepository.findById(userId);
    console.log(user.secondAuthSecret);
    await this.authService.checkOtpApplied(userId, password);
    const authDto: AuthDto = new AuthDto(
      user.id,
      user.nickname,
      false,
      ROLETYPE_MEMBER,
    );
    const accessToken: string = await this.authService.createJwtFromUser(
      authDto,
    );
    return new JwtDto(accessToken);
  }

  @Delete('/tfa')
  @UseGuards(AuthGuard('jwt'))
  async turnOffOtp(@Requestor() requestor: UserIdCardDto) {
    const userId: number = requestor.id;
    const user: User = await this.userRepository.findById(userId);
    await this.userRepository.updateSecondAuth(user, null);
  }
}
