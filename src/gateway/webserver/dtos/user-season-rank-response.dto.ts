export class UserSeasonRankResponseDto {
  bestLp: number | null;

  rank: number | null;

  tier: 'egg' | 'student' | 'bachelor' | 'master' | 'doctor';
}
