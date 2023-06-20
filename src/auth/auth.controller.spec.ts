import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { TestService } from 'src/test/test.service';
import { DataSource } from 'typeorm';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';

describe('AuthController', () => {
  let app: INestApplication;
  let testService: TestService;
  let dataSources: DataSource;

  initializeTransactionalContext();
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    testService = moduleFixture.get<TestService>(TestService);
    dataSources = moduleFixture.get<DataSource>(DataSource);
    await dataSources.synchronize(true);
  });
  beforeEach(async () => {
    await testService.createProfileImages();
  });
  afterAll(async () => {
    await dataSources.dropDatabase();
    await dataSources.destroy();
    // await app.close();
  });

  afterEach(async () => {
    testService.clear();
    jest.resetAllMocks();
    await dataSources.synchronize(true);
  });

  describe('AUTH CONTROLLER TEST', () => {
    describe('POST /auth/singup', () => {
      it('[Error Case] jwt 가드 에 막혔을때 : 닉네임이 있을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .post(`/auth/signup`)
          .send({ nickname: 'test', imgId: 1 })
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(400);
      });
      it('[Valid Case] 요청 성공했을때 : 닉네임이 null 이고 토큰 통과', async () => {
        const user = await testService.createNonameUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .post(`/auth/signup`)
          .send({ nickname: 'private', imgId: 1 })
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(201);
      });
    });
  });
});
