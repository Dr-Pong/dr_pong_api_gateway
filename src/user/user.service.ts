import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { IsolationLevel, Transactional } from 'typeorm-transactional';
import { UserRepository } from './user.repository';
import { ProfileImageRepository } from '../auth/profile-image.repository';
import { PatchUserImageDto } from './dtos/patch-user-image.dto';
import { IsTfaOnResponseDto } from './dtos/tfa-on.response.dto';

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
    await axios.patch(
      process.env.WEBSERVER_URL + `/users/${nickname}/image`,
      { id: patchDto.imgId },
      {
        headers: { Authorization: accessToken },
      },
    );
    await axios.patch(
      process.env.CHATSERVER_URL + `/users/${nickname}/image`,
      { id: patchDto.imgId },
      {
        headers: { Authorization: accessToken },
      },
    );
  }

  async isTfaOnByUser(userId: number): Promise<IsTfaOnResponseDto> {
    const user = await this.userRepository.findById(userId);
    return new IsTfaOnResponseDto(user.secondAuthSecret !== null);
  }
}
