export class FriendDirectMessageChatListResponseDto {
  chatList: {
    id: number;
    message: string;
    nickname: string;
    createdAt: Date;
  }[];
  isLastPage: boolean;
}
