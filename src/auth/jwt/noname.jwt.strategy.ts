import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthDto } from '../dto/auth.dto';
import { TokenInterface } from './jwt.token.interface';
import { UserRepository } from '../../user/user.repository';
import { ROLETYPE_NONAME } from '../../user/type.user.roletype';

@Injectable()
export class JwtStrategyNoname extends PassportStrategy(Strategy, 'jwtNoname') {
  constructor(private readonly userRepository: UserRepository) {
    super({
      secretOrKey: 'jwtSecret',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  // users: Map<string, AuthDto> = new Map();

  async validate(payload): Promise<AuthDto> {
    const user = await this.findUser(payload);
    return user;
  }

  async findUser(token: TokenInterface): Promise<AuthDto> {
    const userFromDb = await this.userRepository.findById(+token['id']);
    if (userFromDb.nickname) throw new BadRequestException();

    const existUser: AuthDto = new AuthDto(
      userFromDb.id,
      userFromDb.nickname,
      token.secondAuthRequierd,
      ROLETYPE_NONAME,
    );
    return existUser;
  }
}
