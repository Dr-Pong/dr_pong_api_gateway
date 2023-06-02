export class UserDetailResponseDto {
  nickname: string;

  imgUrl: string;

  level: number;

  title: { id: number; title: string };

  statusMessage: string;
}
