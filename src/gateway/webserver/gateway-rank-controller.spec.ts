import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';
import { TestService } from 'src/test/test.service';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { User } from 'src/auth/user.entity';

describe('RankController', () => {
  let app: INestApplication;
  let dataSources: DataSource;
  let testService: TestService;
  initializeTransactionalContext();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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

  afterEach(async () => {
    testService.clear();
    jest.resetAllMocks();
    await dataSources.synchronize(true);
  });
  describe('ROUTE RANK GET TEST', () => {
    describe('/ranks/top', () => {
      it('count 가 ~ 일때', async () => {
        const response = await request(app.getHttpServer()).get('/ranks/top');
        expect(response.statusCode).not.toBe(200);
        expect(response.body).not.toHaveProperty('nickname');
      });
      it('라우팅 유저 닉네임 있는 경우', async () => {
        const user: User = await testService.createBasicUser();
        const response = await request(app.getHttpServer()).get(
          '/users/' + user.nickname + '/detail',
        );
        expect(response.statusCode).toBe(200);
        // 인자 확인.
        expect(response.body).toHaveProperty('nickname');
        expect(response.body).toHaveProperty('imgUrl');
        expect(response.body).toHaveProperty('statusMessage');
        // expect(response.body.nickname).toBe(user.nickname); //원하는 데이터 넣기
        // expect(response.body.imgUrl).toBe(user.image.url); //원하는 데이터 넣기
        // expect(response.body.statusMessage).toBe(user.statusMessage); //원하는 데이터 넣기
      });
    });
    describe('/ranks/bottom', () => {
      it('라우팅 유저 닉에임이 없는 경우', async () => {
        const response = await request(app.getHttpServer()).get(
          '/users/' + 'notExistNickname' + '/detail',
        );
        expect(response.statusCode).not.toBe(200);
        expect(response.body).not.toHaveProperty('nickname');
      });
      it('라우팅 유저 닉네임 있는 경우', async () => {
        const user: User = await testService.createBasicUser();
        const response = await request(app.getHttpServer()).get(
          '/users/' + user.nickname + '/detail',
        );
        expect(response.statusCode).toBe(200);
        // 인자 확인.
        expect(response.body).toHaveProperty('nickname');
        expect(response.body).toHaveProperty('imgUrl');
        expect(response.body).toHaveProperty('statusMessage');
        // expect(response.body.nickname).toBe(user.nickname); //원하는 데이터 넣기
        // expect(response.body.imgUrl).toBe(user.image.url); //원하는 데이터 넣기
        // expect(response.body.statusMessage).toBe(user.statusMessage); //원하는 데이터 넣기
      });
    });
  });
});
