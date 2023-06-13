import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PostChannelRequestDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  access: 'public' | 'private';

  password: string | null;

  @IsNotEmpty()
  maxCount: number;
}
