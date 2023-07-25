import { IsPositive, IsString, Length, IsNotEmpty, Min } from 'class-validator';
import {
  FixedArraySize,
  CheckArrayValueNumberOrNull,
} from 'src/gateway/validation/custom-decorator-validate';
import { IsIntOrNull } from '../validation/custom-decorator-validate';

export class PatchUserTitleRequestDto {
  @IsIntOrNull()
  @Min(1)
  id: number | null;
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
  @FixedArraySize(process.env.EMOJI_ARRAY_SIZE)
  @CheckArrayValueNumberOrNull()
  ids: (number | null)[];
}
