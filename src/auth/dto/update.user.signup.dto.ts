import { ProfileImage } from '../profile-image.entity';
import { User } from '../user.entity';

export class UpdateUserSignUpDto {
  user: User;
  profileImage: ProfileImage;
  nickname: string;
}
