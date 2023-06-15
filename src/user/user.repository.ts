import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UpdateUserSignUpDto } from '../auth/dto/update.user.signup.dto';
import { CreateUserDto } from '../auth/dto/create.user.dto';
import { AuthDto } from '../auth/dto/auth.dto';
import { ROLETYPE_MEMBER } from './type.user.roletype';
import { ProfileImage } from '../auth/profile-image.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.repository.findOne({ where: { email } });
  }

  async findByNickname(nickname: string): Promise<User> {
    return await this.repository.findOne({ where: { nickname } });
  }

  async createUser(createDto: CreateUserDto): Promise<User> {
    return await this.repository.save({ email: createDto.email });
  }
  async updateUserImage(userId: number, image: ProfileImage): Promise<void> {
    await this.repository.update(userId, { image: image });
  }
  async signUp(updateDto: UpdateUserSignUpDto): Promise<AuthDto> {
    updateDto.user.image = updateDto.profileImage;
    updateDto.user.nickname = updateDto.nickname;
    const user: User = await this.repository.save(updateDto.user);
    return {
      id: user.id,
      nickname: user.nickname,
      secondAuthRequired: false,
      roleType: ROLETYPE_MEMBER,
    };
  }

  async updateSecondAuth(user: User, secretKey: string) {
    user.secondAuthSecret = secretKey;
    await this.repository.save(user);
  }
}
