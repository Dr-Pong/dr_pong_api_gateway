export class UserEmojisResponseDto {
  emojis: {
    id: number;

    name: string;

    imgUrl: string;

    status: 'selected' | 'achieved' | 'unachieved';
  }[];
}
