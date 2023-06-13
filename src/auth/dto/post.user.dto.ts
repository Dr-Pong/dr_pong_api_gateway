export class postUserDto {
  id: number;

  nickname: string;

  imgId: number;

  imgUrl: string;
  constructor(id: number, nickname: string, imgId: number, imgUrl: string) {
    this.id = id;
    this.nickname = nickname;
    this.imgId = imgId;
    this.imgUrl = imgUrl;
  }
}
