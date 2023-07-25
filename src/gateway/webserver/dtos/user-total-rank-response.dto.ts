export class UserTotalRankResponseDto {
  bestLp: number | null;

  rank: number | null;

  tier: 'egg' | 'student' | 'bachelor' | 'master' | 'doctor';
}
