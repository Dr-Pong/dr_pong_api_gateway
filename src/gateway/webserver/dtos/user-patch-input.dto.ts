import {
  IsPositive,
  IsString,
  Length,
  IsNotEmpty,
  IsInt,
  Min,
} from 'class-validator';
import {
  FixedArraySize,
  CheckArrayValueNumberOrNull,
} from 'src/gateway/validation/custom-decorator-validate';

export class PatchUserTitleRequestDto {
  @IsInt()
  @Min(0)
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
  @FixedArraySize(3)
  @CheckArrayValueNumberOrNull()
  ids: (number | null)[];
}

export class PatchUserEmojisRequestDto {
  @FixedArraySize(4)
  @CheckArrayValueNumberOrNull()
  ids: (number | null)[];
}
