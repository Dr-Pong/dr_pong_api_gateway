import { RoleType } from '../type.user.roletype';
import { ROLETYPE_GUEST, ROLETYPE_NONAME } from '../type.user.roletype';

export class UserMeDto {
  nickname: string;
  imgUrl: string;
  isSecondAuthOn: boolean;
  roleType: RoleType;
  constructor(
    nickname: string,
    imgUrl: string,
    isSecondAuthOn: boolean,
    roleType: RoleType,
  ) {
    this.nickname = nickname;
    this.imgUrl = imgUrl;
    this.isSecondAuthOn = isSecondAuthOn;
    this.roleType = roleType;
  }
  static guestUserMe(): UserMeDto {
    return {
      nickname: '',
      imgUrl: '',
      isSecondAuthOn: false,
      roleType: ROLETYPE_GUEST,
    };
  }
  static nonameUserMe(): UserMeDto {
    return {
      nickname: '',
      imgUrl: '',
      isSecondAuthOn: false,
      roleType: ROLETYPE_NONAME,
    };
  }
}
