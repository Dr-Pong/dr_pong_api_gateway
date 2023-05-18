import { RoleType } from '../type.user.roletype';

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
}
