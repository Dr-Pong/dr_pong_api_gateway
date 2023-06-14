export default class ChannelInviteListResponseDto {
  invitations: {
    id: string;
    channelId: string;
    channelName: string;
    from: string;
    createdAt: Date;
  }[];
}
