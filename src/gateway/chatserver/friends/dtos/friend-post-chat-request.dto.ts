import { Transform } from 'class-transformer';
import { Length } from 'class-validator';

export class PostFriendChatRequestDto {
  @Transform(({ value }) => value.trim())
  @Length(1, 100)
  message: string;
}
