import { RoleType } from '../type.user.roletype';

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
}
