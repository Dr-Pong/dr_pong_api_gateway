import { IsPositive, IsString, Length, IsNotEmpty } from 'class-validator';

export class PatchUserTitleRequestDto {
  @IsPositive()
  id: number;
}

export class PatchUserImageRequestDto {
  @IsPositive()
  id: number;
}

export class PatchUserMessageRequestDto {
  // 프론트와 status message 길이 정하기, null 들어갈수 있는지
  @IsString()
  @IsNotEmpty()
  @Length(0, 60, {
    message: 'Message length must be between 1 and 60 characters',
  })
  message: string;
}

export class PatchUserAchievementsRequestDto {
  @IsPositive({ each: true })
  ids: (number | null)[];
}

export class PatchUserEmojisRequestDto {
  @IsPositive({ each: true })
  ids: (number | null)[];
}
