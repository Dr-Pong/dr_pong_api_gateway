import { RoleType } from '../type.user.roletype';
import { User } from '../user.entity';
import { ROLETYPE_NONAME } from '../type.user.roletype';
export class AuthDto {
  id: number;
  nickname: string;
  secondAuthRequired: boolean;
  roleType: RoleType;
  constructor(
    id: number,
    nickname: string,
    secondAuthRequired: boolean,
    roleType: RoleType,
  ) {
    this.id = id;
    this.nickname = nickname;
    this.secondAuthRequired = secondAuthRequired;
    this.roleType = roleType;
  }
  static defaultUser(
    id: number,
    nickname: string,
    secondAuthRequired: boolean,
    roleType: RoleType,
  ): AuthDto {
    return {
      id: id,
      nickname: nickname,
      secondAuthRequired: secondAuthRequired,
      roleType: roleType,
    };
  }

  static fromNonameUser(user: User): AuthDto {
    return {
      id: user.id,
      nickname: user.nickname,
      secondAuthRequired: user.secondAuthSecret !== null,
      roleType: ROLETYPE_NONAME,
    };
  }
}
