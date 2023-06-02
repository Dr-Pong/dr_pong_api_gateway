export class UserAchievementsResponseDto {
  achievements: {
    id: number;

    name: string;

    imgUrl: string;

    content: string;

    status: 'selected' | 'achieved' | 'unachieved';
  }[];
}
