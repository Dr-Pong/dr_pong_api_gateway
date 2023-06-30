import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthDto } from '../dto/auth.dto';
import { TokenInterface } from './jwt.token.interface';
import { UserRepository } from '../../user/user.repository';
import {
  ROLETYPE_MEMBER,
  ROLETYPE_NONAME,
} from '../../user/type.user.roletype';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      secretOrKey: 'jwtSecret',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  // users: Map<string, AuthDto> = new Map();

  async validate(payload): Promise<AuthDto> {
    const user = await this.findUser(payload);
    this.validateUser(payload);
    return user;
  }

  async findUser(token: TokenInterface): Promise<AuthDto> {
    const userFromMemory = this.users.get(token.nickname);

    if (userFromMemory) return userFromMemory;

    const userFromDb = await this.userRepository.findByNickname(
      token['nickname'],
    );
    if (!userFromDb) throw new UnauthorizedException();

    const existUser: AuthDto = new AuthDto(
      userFromDb.id,
      userFromDb.nickname,
      token.secondAuthRequierd,
      ROLETYPE_NONAME,
    );
    if (userFromDb.nickname) existUser.roleType = ROLETYPE_MEMBER;
    return existUser;
  }

  /** 닉네임 설정이 안되어 있거나 2차 인증이 필요하면 에러 반환 */
  validateUser(token: TokenInterface): void {
    if (token.nickname === null || token.secondAuthRequierd === true)
      throw new UnauthorizedException();
  }
}
