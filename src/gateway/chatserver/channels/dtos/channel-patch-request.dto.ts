export class ChannelPatchRequestDto {
  access: 'public' | 'private';

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
