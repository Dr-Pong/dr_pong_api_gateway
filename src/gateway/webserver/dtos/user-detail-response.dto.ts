export class UserDetailResponseDto {
  nickname: string;

  image: { id: number; url: string };

  level: number;

  title: { id: number; title: string };

  statusMessage: string;
}
