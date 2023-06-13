export class ChannelPageResponseDto {
  channels: {
    id: string;
    title: string;
    access: 'public' | 'protected' | 'private';
    headCount: number;
    maxCount: number;
  }[];
  currentPage: number;
  totalPage: number;
}
