import { RoleType } from '../../user/type.user.roletype';

export class TokenInterface {
  id: number;
  nickname: string;
  roleType: RoleType;
  secondAuthRequierd: boolean;
  imp: number;
  exp: number;
}
