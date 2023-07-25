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
import { UserRepository } from '../user/user.repository';
import { ProfileImageRepository } from './profile-image.repository';
import { UserMeDto } from './dto/user.me.dto';
import { TokenInterface } from './jwt/jwt.token.interface';
import { GetUserMeDto } from './dto/get.user.me.dto';
import { ROLETYPE_MEMBER, ROLETYPE_NONAME } from '../user/type.user.roletype';
import { User } from '../user/user.entity';
import { ProfileImage } from './profile-image.entity';
import { generateOtpDto } from './dto/auth.generateOtp.response.dto';
import { postUserDto } from './dto/post.user.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly imageRepository: ProfileImageRepository,
    private readonly jwtService: JwtService,
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

    const cipher = crypto.createCipheriv(
      process.env.CRYPTO_ALGORITHM,
      Buffer.from(process.env.CRYPTO_SECRET_KEY, 'hex'), // Use your own secret key
      Buffer.from(process.env.CRYPTO_SECRET_IV, 'hex'),
    );
    let encryptedSecretKey = cipher.update(secretKey, 'utf-8', 'base64');
    encryptedSecretKey += cipher.final('base64');

    this.secondAuth.set(userId, encryptedSecretKey);

    return generateOtpDto.response(secretKey, url, qrCode);
  }

  @Transactional({ isolationLevel: IsolationLevel.REPEATABLE_READ })
  async checkOtpApplied(userId: number, token: string) {
    const encryptedSecretKey = this.secondAuth.get(userId);
    if (!encryptedSecretKey) {
      return;
    }
    const decipher = crypto.createDecipheriv(
      process.env.CRYPTO_ALGORITHM,
      Buffer.from(process.env.CRYPTO_SECRET_KEY, 'hex'), // Use your own secret key
      Buffer.from(process.env.CRYPTO_SECRET_IV, 'hex'), // Use the IV you used for encryption
    );
    let secretKey = decipher.update(encryptedSecretKey, 'base64', 'utf-8');
    secretKey += decipher.final('utf-8');

    const isValid: boolean = authenticator.verify({
      token,
      secret: secretKey,
    });
    if (!isValid) throw new UnauthorizedException();
    const user = await this.userRepository.findById(userId);
    if (user.secondAuthSecret) throw new BadRequestException();

    await this.userRepository.updateSecondAuth(user, encryptedSecretKey);
  }

  @Transactional({ isolationLevel: IsolationLevel.REPEATABLE_READ })
  async verifyOtp(userId: number, token: string): Promise<boolean> {
    const user: User = await this.userRepository.findById(userId);
    if (!user.secondAuthSecret) throw new BadRequestException();

    const decipher = crypto.createDecipheriv(
      process.env.CRYPTO_ALGORITHM,
      Buffer.from(process.env.CRYPTO_SECRET_KEY, 'hex'), // Use your own secret key
      Buffer.from(process.env.CRYPTO_SECRET_IV, 'hex'), // Use the IV you used for encryption
    );
    let secretKey = decipher.update(user.secondAuthSecret, 'base64', 'utf-8');
    secretKey += decipher.final('utf-8');
    const isValid: boolean = authenticator.verify({
      token,
      secret: secretKey,
    });
    if (!isValid) throw new UnauthorizedException();

    return isValid;
  }

  @Transactional({ isolationLevel: IsolationLevel.REPEATABLE_READ })
  async signUp(signUpDto: SignUpDto): Promise<AuthDto> {
    const { user, profileImage } = await this.validateSignUp(signUpDto);
    const signUser: AuthDto = await this.userRepository.signUp({
      user,
      profileImage,
      nickname: signUpDto.nickname,
      secondAuthRequierd: false,
    });
    const uploadUser = new postUserDto(
      signUser.id,
      signUser.nickname,
      profileImage.id,
      profileImage.url,
    );
    await this.requestStoreUserInfoEachServers(uploadUser);
    return signUser;
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
    const email: string = response.data.email;
    const existUser: User = await this.userRepository.findByEmail(email);

    let authdto: AuthDto;
    if (!existUser) {
      const newUser = await this.userRepository.createUser({ email });
      authdto = AuthDto.defaultUser(newUser.id, null, false, ROLETYPE_NONAME);
    } else {
      authdto = AuthDto.fromNonameUser(existUser);
      if (existUser.nickname) authdto.roleType = ROLETYPE_MEMBER;
    }
    return authdto;
  }

  async getGoogleAccessToken(authCode: string): Promise<string> {
    this.logger.log(process.env.GG_TOKEN_URI);
    try {
      const response = await axios.post(process.env.GG_TOKEN_URI, {
        grant_type: 'authorization_code',
        code: authCode,
        client_id: process.env.GG_CLIENT_ID,
        client_secret: process.env.GG_CLIENT_SECRET,
        redirect_uri: process.env.GG_REDIRECT_URI,
      });
      return response.data.access_token;
    } catch (error) {
      this.logger.log(error);
      throw new UnauthorizedException();
    }
  }

  async getGoogleUserInfo(accessToken: string): Promise<AuthDto> {
    const response = await axios.get(process.env.GG_USER_INFO, {
      headers: { Authorization: 'Bearer ' + accessToken },
    });
    if (response.status !== 200) throw new UnauthorizedException();
    const email: string = response.data.email;
    const existUser: User = await this.userRepository.findByEmail(email);
    let authdto: AuthDto;
    if (!existUser) {
      const newUser = await this.userRepository.createUser({ email });
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
      secondAuthRequired: user.secondAuthRequired ?? false,
      roleType: user.roleType,
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
    const decode = this.jwtService.verify(getDto.token);

    const jwt: TokenInterface = this.jwtService.verify(getDto.token);
    if (jwt.roleType === ROLETYPE_NONAME) {
      return UserMeDto.nonameUserMe();
    }

    const user = await this.userRepository.findById(jwt.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    const responseDto: UserMeDto = UserMeDto.fromUser(user);
    if (user.nickname) {
      responseDto.roleType = ROLETYPE_MEMBER;
      responseDto.tfaRequired = decode.secondAuthRequired;
    }
    return responseDto;
  }

  async requestStoreUserInfoEachServers(uploadUser: postUserDto) {
    await this.axiosRequestStoreServer(process.env.WEBSERVER_URL, uploadUser);
    await this.axiosRequestStoreServer(process.env.CHATSERVER_URL, uploadUser);
    await this.axiosRequestStoreServer(process.env.GAMESERVER_URL, uploadUser);
  }

  async axiosRequestStoreServer(serverLocation: string, user: postUserDto) {
    await axios.post(serverLocation + '/users', user);
  }
}
