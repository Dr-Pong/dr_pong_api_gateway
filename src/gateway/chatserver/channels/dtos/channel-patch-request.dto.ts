import { IsOptional, IsString } from 'class-validator';

export class ChannelPatchRequestDto {
  access: 'public' | 'private';

  @IsOptional()
  @IsString()
  password: string | null;

  static default(
    access: 'public' | 'private',
    password?: string,
  ): ChannelPatchRequestDto {
    return {
      access: access,
      password: password ? password : null,
    };
  }
}
