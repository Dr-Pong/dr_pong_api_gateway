import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ROLETYPE_MEMBER } from 'src/auth/type.user.roletype';
import { ProfileImage } from 'src/auth/profile-image.entity';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ProfileImage)
    private profileImageRepository: Repository<ProfileImage>,
  ) {}
  users: User[] = [];
  profileImages: ProfileImage[] = [];

  clear(): void {
    this.users.splice(0);
    this.profileImages.splice(0);
  }

  async createProfileImages(): Promise<void> {
    this.profileImages.push(
      await this.profileImageRepository.save({
        url: 'basic image1',
      }),
    );
    this.profileImages.push(
      await this.profileImageRepository.save({
        url: 'basic image2',
      }),
    );
  }

  /** 유저 생성 태초 유저임*/
  async createBasicUser(): Promise<User> {
    const index: number = this.users.length;
    const user = await this.userRepository.save({
      nickname: 'user' + index.toString(),
      email: index.toString() + '@mail.com',
      statusMessage: index.toString(),
      image: this.profileImages[0],
      roleType: ROLETYPE_MEMBER,
    });
    this.users.push(user);
    return user;
  }

  async createBasicUsers(): Promise<void> {
    // 해결
    for (let i = 0; i < 10; i++) {
      const user = await this.userRepository.save({
        nickname: 'user' + i.toString(),
        email: i.toString() + '@mail.com',
        statusMessage: i.toString(),
        image: this.profileImages[i % 2],
      });
      this.users.push(user);
    }
  }

  /** 이미지 없는 유저 생성*/
  async createBasicUserWithoutImg(): Promise<User> {
    const index: number = this.users.length;
    const user = await this.userRepository.save({
      nickname: 'user' + index.toString(),
      email: index.toString() + '@mail.com',
      statusMessage: index.toString(),
      image: this.profileImages[0],
    });
    this.users.push(user);
    return user;
  }

  /**이모지가 아예 없는 유저 생성*/
  async createUserWithUnAchievedEmoji(): Promise<User> {
    const user: User = await this.userRepository.save({
      nickname: 'userWithoutAchievements',
      email: '@mail.com',
      image: this.profileImages[0],
    });
    return user;
  }

  /** 어치브먼트가 아예 없는 유저 생성*/
  async createUserWithUnAchievedAchievements(): Promise<User> {
    const user: User = await this.userRepository.save({
      nickname: 'userWithoutAchievements',
      email: '@mail.com',
      image: this.profileImages[0],
    });
    return user;
  }
}
