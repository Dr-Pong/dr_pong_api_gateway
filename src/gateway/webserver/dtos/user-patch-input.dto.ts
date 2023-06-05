import { IsPositive, IsString, Length, IsNotEmpty } from 'class-validator';
import {
  FixedArraySize,
  CheckArrayValueNumberOrNull,
} from 'src/custom/custom-decorator-validate-pipe';

export class PatchUserTitleRequestDto {
  @IsPositive()
  id: number;
}

export class PatchUserImageRequestDto {
  @IsPositive()
  id: number;
}

export class PatchUserMessageRequestDto {
  @IsString()
  @IsNotEmpty()
  @Length(0, 60, {
    message: 'Message length must be between 1 and 60 characters',
  })
  message: string;
}

export class PatchUserAchievementsRequestDto {
  @FixedArraySize(process.env.ACHIEVEMENTS_ARRAY_SIZE)
  @CheckArrayValueNumberOrNull()
  ids: (number | null)[];
}

export class PatchUserEmojisRequestDto {
  @FixedArraySize(process.env.EMOJIS_ARRAY_SIZE)
  @CheckArrayValueNumberOrNull()
  ids: (number | null)[];
}
