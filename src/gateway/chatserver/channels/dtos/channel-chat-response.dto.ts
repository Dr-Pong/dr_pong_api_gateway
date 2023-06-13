export class ChannelChatsResponseDto {
  chats: {
    id: number;
    message: string;
    nickname: string;
    time: Date;
    type: 'me' | 'others' | 'system';
  }[];
  isLastPage: boolean;
}
