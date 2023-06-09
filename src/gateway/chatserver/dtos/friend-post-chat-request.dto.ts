import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class PostFriendChatRequestDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(1, 100)
  message: string;
}
