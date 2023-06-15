import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { IsolationLevel, Transactional } from 'typeorm-transactional';
import { UserRepository } from './user.repository';
import { ProfileImageRepository } from '../auth/profile-image.repository';
import { PatchUserImageDto } from './dtos/patch-user-image.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileImageRepository: ProfileImageRepository,
  ) {}
  private readonly logger: Logger = new Logger(UserService.name);

  @Transactional({ isolationLevel: IsolationLevel.REPEATABLE_READ })
  async patchUserImage(
    nickname: string,
    accessToken: string,
    patchDto: PatchUserImageDto,
  ): Promise<void> {
    const user = await this.userRepository.findById(patchDto.userId);
    if (!user) throw new NotFoundException('No such User');
    const image = await this.profileImageRepository.findById(patchDto.imgId);
    if (!image) throw new NotFoundException('No such Image');

    await this.userRepository.updateUserImage(user.id, image);
    await this.patchImageRouteWebAndChatServer(nickname, accessToken, patchDto);
  }

  async patchImageRouteWebAndChatServer(
    nickname: string,
    accessToken: string,
    patchDto: PatchUserImageDto,
  ) {
    await this.axiosPatchRequestEachServer(
      nickname,
      accessToken,
      process.env.WEBSERVER_URL,
      patchDto,
    );
    await this.axiosPatchRequestEachServer(
      nickname,
      accessToken,
      process.env.CHATSERVER_URL,
      patchDto,
    );
  }

  async axiosPatchRequestEachServer(
    nickname: string,
    accessToken: string,
    serverLocation: string,
    patchDto: PatchUserImageDto,
  ) {
    await axios.post(
      serverLocation + `/users/${nickname}/image`,
      { id: patchDto.imgId },
      {
        headers: { Authorization: accessToken },
      },
    );
  }
}
