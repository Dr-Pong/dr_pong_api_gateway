export class UserGameRecordsResponseDto {
  records: {
    gameId: number;
    gameType: 'rank' | 'normal';
    playedAt: string;

    me: {
      imgUrl: string;
      nickname: string;
      score: number;
    };

    you: {
      imgUrl: string;
      nickname: string;
      score: number;
    };

    result: 'win' | 'tie' | 'lose';
  }[];

  isLastPage: boolean;
}
