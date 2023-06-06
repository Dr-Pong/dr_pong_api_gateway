export class UserTotalRankResponseDto {
  record: number | null;

  rank: number | null;

  tier: 'egg' | 'student' | 'bachelor' | 'master' | 'doctor';
}
