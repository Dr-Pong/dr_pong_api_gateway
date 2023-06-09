import { IsBoolean } from 'class-validator';

export class FriendDirectMessageNewResponseDto {
  @IsBoolean()
  hasNewChat: boolean;
}
