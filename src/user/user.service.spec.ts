import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { TestService } from 'src/test/test.service';
import { PatchUserImageDto } from './dtos/patch-user-image.dto';
import { AppModule } from 'src/app.module';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let testService: TestService;
  let dataSources: DataSource;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    initializeTransactionalContext();
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    testService = module.get<TestService>(TestService);
    dataSources = module.get<DataSource>(DataSource);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    await dataSources.synchronize(true);
  });
  beforeEach(async () => {
    await testService.createProfileImages();
  });
  afterEach(async () => {
    jest.resetAllMocks();
    await dataSources.synchronize(true);
  });

  afterAll(async () => {
    await dataSources.dropDatabase();
    await dataSources.destroy();
  });
  describe('patchUserImage(), 유저 이미지 변경', () => {
    it('[Valid Case] 이미지 변경', async () => {
      const user = await testService.createBasicUser();
      const token = await testService.giveTokenToUser(user);
      const imgId: number = user.image.id;
      const patchDto: PatchUserImageDto = {
        userId: user.id,
        imgId,
      };
      await service.patchUserImage('user0', token, patchDto);

      const result: User = await userRepository.findOne({
        where: { id: user.id },
      });

      expect(result.image.id).toBe(imgId);
    });

    it('[Invalid Case] 이미지 변경 실패(없는 유저)', async () => {
      const user = await testService.createBasicUser();
      const token = await testService.giveTokenToUser(user);
      const imgId: number = user.image.id;
      const patchDto: PatchUserImageDto = {
        userId: 1234,
        imgId,
      };

      await expect(
        service.patchUserImage(user.nickname, token, patchDto),
      ).rejects.toThrow(new BadRequestException('No such User'));
    });

    it('[Invalid Case] 이미지 변경 실패(없는 이미지)', async () => {
      const user = await testService.createBasicUser();
      const token = await testService.giveTokenToUser(user);
      const patchDto: PatchUserImageDto = {
        userId: user.id,
        imgId: 1234,
      };

      await expect(
        service.patchUserImage(user.nickname, token, patchDto),
      ).rejects.toThrow(new BadRequestException('No such Image'));
    });

    it('[Invalid Case] 라우팅 실패시', async () => {
      const user = await testService.createBasicUser();
      const token = await testService.giveTokenToUser(user);
      const imgId: number = user.image.id;
      const patchDto: PatchUserImageDto = {
        userId: user.id,
        imgId,
      };
      const response = await service.patchUserImage(
        user.nickname,
        token,
        patchDto,
      );
      console.log(response);
      const result: User = await userRepository.findOne({
        where: { id: user.id },
      });

      expect(result.image.id).not.toBe(imgId);
    });
  });
});
