import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ProfileImage } from './auth/profile-image.entity';
import { ProfileImageRepository } from './auth/profile-image.repository';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private readonly imageRepository: ProfileImageRepository) {}

  async onApplicationBootstrap(): Promise<void> {
    const images: ProfileImage[] = await this.imageRepository.findAll();
    if (images.length === 0) {
      for (let i = 1; i <= 8; i++) {
        await this.imageRepository.save({
          id: i,
          url:
            'https://drpong.s3.ap-northeast-2.amazonaws.com/fishes/' +
            i.toString() +
            '.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
