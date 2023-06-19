import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ProfileImage } from './auth/profile-image.entity';
import { ProfileImageRepository } from './auth/profile-image.repository';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private readonly imageRepository: ProfileImageRepository) {}

  async onApplicationBootstrap(): Promise<void> {
    const images: ProfileImage[] = await this.imageRepository.findAll();
    if (images.length === 0) {
      await this.imageRepository.save(
        {
          id: 1,
          url: 'https://42gg-public-image.s3.ap-northeast-2.amazonaws.com/images/kipark.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          url: 'https://42gg-public-image.s3.ap-northeast-2.amazonaws.com/images/jihyukim.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          url: 'https://42gg-public-image.s3.ap-northeast-2.amazonaws.com/images/nheo.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          url: 'https://42gg-public-image.s3.ap-northeast-2.amazonaws.com/images/hakim.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      );
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
