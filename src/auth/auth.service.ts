import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { AuthDto } from './dto/auth.dto';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { SignUpDto } from './dto/auth.signup.dto';
import { IsolationLevel, Transactional } from 'typeorm-transactional';
import { UserRepository } from './user.repository';
import { ProfileImageRepository } from './profile-image.repository';
import { UserMeDto } from './dto/user.me.dto';
import { TokenInterface } from './jwt/jwt.token.interface';
import { GetUserMeDto } from './dto/get.user.me.dto';
import { ROLETYPE_MEMBER, ROLETYPE_NONAME } from './type.user.roletype';
import { User } from './user.entity';
import { ProfileImage } from './profile-image.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly imageRepository: ProfileImageRepository,
    private jwtService: JwtService,
  ) {}
  private readonly logger: Logger = new Logger(AuthService.name);
  secondAuth: Map<number, string> = new Map();

  @Transactional({ isolationLevel: IsolationLevel.REPEATABLE_READ })
  async generateOtp(userId: number) {
    const secretKey = authenticator.generateSecret();
    const url = authenticator.keyuri(String(userId), 'Dr.Pong', secretKey);
    const qrCode = await toDataURL(url);

    const user = await this.userRepository.findById(userId);
    if (user.secondAuthSecret) throw new BadRequestException();

    this.secondAuth.set(userId, secretKey);

    return {
      secretKey,
      url,
      qrCode,
    };
  }

  @Transactional({ isolationLevel: IsolationLevel.REPEATABLE_READ })
  async checkOtpApplied(userId: number, token: string) {
    const secretKey = this.secondAuth.get(userId);
    if (!secretKey) {
      return;
    }

    const isValid: boolean = authenticator.verify({
      token,
      secret: secretKey,
    });
    if (!isValid) throw new UnauthorizedException();

    const user = await this.userRepository.findById(userId);
    if (user.secondAuthSecret) throw new BadRequestException();

    await this.userRepository.updateSecondAuth(user, secretKey);
  }

  @Transactional({ isolationLevel: IsolationLevel.REPEATABLE_READ })
  async verifyOtp(userId: number, token: string): Promise<boolean> {
    const user: User = await this.userRepository.findById(userId);
    if (user.secondAuthSecret) throw new BadRequestException();

    const isValid: boolean = authenticator.verify({
      token,
      secret: user.secondAuthSecret,
    });
    if (!isValid) throw new UnauthorizedException();

    return isValid;
  }

  @Transactional({ isolationLevel: IsolationLevel.REPEATABLE_READ })
  async signUp(signUpDto: SignUpDto) {
    const { user, profileImage } = await this.validateSignUp(signUpDto);
    await this.userRepository.signUp({
      user,
      profileImage,
      nickname: signUpDto.nickname,
    });
  }

  async getFTAccessToken(authCode: string): Promise<string> {
    this.logger.log(process.env.FT_TOKEN_URI);
    try {
      const response = await axios.post(process.env.FT_TOKEN_URI, {
        grant_type: 'authorization_code',
        code: authCode,
        client_id: process.env.FT_CLIENT_ID,
        client_secret: process.env.FT_CLIENT_SECRET,
        redirect_uri: process.env.FT_REDIRECT_URI,
      });
      return response.data.access_token;
    } catch (error) {
      this.logger.log(error);
      throw new UnauthorizedException();
    }
  }

  async getFTUserInfo(accessToken: string): Promise<AuthDto> {
    const response = await axios.get(process.env.FT_USER_INFO, {
      headers: { Authorization: 'Bearer ' + accessToken },
    });
    if (response.status !== 200) throw new UnauthorizedException();
    const email = response.data.email;
    const existUser: User = await this.userRepository.findByEmail(email);

    let authdto: AuthDto;
    if (!existUser) {
      const newUser = await this.userRepository.createUser(email);
      authdto = AuthDto.defaultUser(newUser.id, null, false, ROLETYPE_NONAME);
    } else {
      authdto = AuthDto.fromNonameUser(existUser);
      if (existUser.nickname) authdto.roleType = ROLETYPE_MEMBER;
    }
    return authdto;
  }

  async createJwtFromUser(user: AuthDto): Promise<string> {
    const token = this.jwtService.sign({
      id: user.id,
      nickname: user.nickname,
      secondAuthRequired: user.secondAuthRequired,
    });
    return token;
  }

  async validateSignUp(
    signUpDto: SignUpDto,
  ): Promise<{ user: User; profileImage: ProfileImage }> {
    const user = await this.userRepository.findById(signUpDto.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.nickname !== null) {
      throw new BadRequestException();
    }
    if (await this.userRepository.findByNickname(signUpDto.nickname)) {
      throw new ConflictException();
    }
    const profileImage: ProfileImage = await this.imageRepository.findById(
      signUpDto.imageId,
    );
    if (!profileImage) {
      throw new BadRequestException();
    }
    return { user, profileImage };
  }

  async getUserMe(getDto: GetUserMeDto): Promise<UserMeDto> {
    if (!getDto.token) {
      return UserMeDto.guestUserMe();
    }

    const jwt: TokenInterface = this.jwtService.verify(getDto.token);
    if (jwt.roleType === ROLETYPE_NONAME) {
      return UserMeDto.nonameUserMe();
    }

    const user = await this.userRepository.findById(jwt.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    const responseDto: UserMeDto = UserMeDto.fromUser(user);
    if (user.nickname) responseDto.roleType = ROLETYPE_MEMBER;

    return responseDto;
  }
}
