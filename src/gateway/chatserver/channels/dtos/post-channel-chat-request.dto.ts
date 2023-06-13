import { Transform } from 'class-transformer';
import { Length } from 'class-validator';

export class PostChannelChatRequestDto {
  @Length(1, 100)
  @Transform(({ value }) => value.trim())
  message: string;
}
