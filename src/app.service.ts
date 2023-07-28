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
          url: 'https://drpong.s3.ap-northeast-2.amazonaws.com/developers/hakim.png',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          url: 'https://drpong.s3.ap-northeast-2.amazonaws.com/developers/jiyun.png',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          url: 'https://drpong.s3.ap-northeast-2.amazonaws.com/developers/jihyukim.png',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          url: 'https://drpong.s3.ap-northeast-2.amazonaws.com/developers/jaehwkim.png',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          url: 'https://drpong.s3.ap-northeast-2.amazonaws.com/developers/junyopar.png',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          url: 'https://drpong.s3.ap-northeast-2.amazonaws.com/developers/keokim.png',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          url: 'https://drpong.s3.ap-northeast-2.amazonaws.com/developers/nheo.png',
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
