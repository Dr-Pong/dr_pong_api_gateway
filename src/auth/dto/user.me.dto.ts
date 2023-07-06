import { RoleType } from '../../user/type.user.roletype';
import { ROLETYPE_GUEST, ROLETYPE_NONAME } from '../../user/type.user.roletype';
import { User } from '../../user/user.entity';

export class UserMeDto {
  nickname: string;
  imgUrl: string;
  tfaRequired: boolean;
  roleType: RoleType;
  constructor(
    nickname: string,
    imgUrl: string,
    isSecondAuthOn: boolean,
    roleType: RoleType,
  ) {
    this.nickname = nickname;
    this.imgUrl = imgUrl;
    this.tfaRequired = isSecondAuthOn;
    this.roleType = roleType;
  }
  static guestUserMe(): UserMeDto {
    return {
      nickname: '',
      imgUrl: '',
      tfaRequired: false,
      roleType: ROLETYPE_GUEST,
    };
  }
  static nonameUserMe(): UserMeDto {
    return {
      nickname: '',
      imgUrl: '',
      tfaRequired: false,
      roleType: ROLETYPE_NONAME,
    };
  }
  static fromUser(user: User): UserMeDto {
    return {
      nickname: user.nickname,
      imgUrl: user.image.url,
      tfaRequired: user.secondAuthSecret !== null,
      roleType: ROLETYPE_NONAME,
    };
  }
}
