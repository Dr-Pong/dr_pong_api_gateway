export class ChannelParticipantsResponseDto {
  me: {
    nickname: string;
    imgUrl: string;
    roleType: 'owner' | 'admin' | 'normal';
    isMuted: boolean;
  };
  participants: {
    nickname: string;
    imgUrl: string;
    roleType: 'owner' | 'admin' | 'normal';
    isMuted: boolean;
  }[] = [];
  headCount: number;
  maxCount: number;
}
