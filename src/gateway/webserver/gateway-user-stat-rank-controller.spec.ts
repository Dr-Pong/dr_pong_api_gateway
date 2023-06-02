import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { TestService } from 'src/test/test.service';
import { DataSource } from 'typeorm';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';
import { User } from 'src/auth/user.entity';
describe('GatewayController', () => {
  let app: INestApplication;
  let testService: TestService;
  let dataSources: DataSource;
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

  describe('ROUTE USER GET STATS & RANK TEST', () => {
    describe('/users/{nickname}/stats/total', () => {
      it('라우팅 유저 닉네임 없는 경우', async () => {
        const user: User = await testService.createBasicUser();
        const response = await request(app.getHttpServer()).get(
          '/users/' + user.nickname + 'noexist' + '/stats/total',
        );
        expect(response.statusCode).not.toBe(200);
        expect(response.body).not.toHaveProperty('wins');
      });
      it('라우팅 유저 닉네임 있는 경우', async () => {
        const user = await testService.createBasicUser();
        const response = await request(app.getHttpServer()).get(
          '/users/' + user.nickname + 'noexist' + '/stats/total',
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('winRate');
        expect(response.body).toHaveProperty('wins');
        expect(response.body).toHaveProperty('ties');
        expect(response.body).toHaveProperty('loses');
      });
    });

    describe('/users/{nickname}/stats/season', () => {
      it('라우팅 유저 닉네임 없는 경우', async () => {
        const user: User = await testService.createBasicUser();
        const response = await request(app.getHttpServer()).get(
          '/users/' + user.nickname + 'noexist' + '/stats/season',
        );
        expect(response.statusCode).not.toBe(200);
        expect(response.body).not.toHaveProperty('wins');
      });
      it('라우팅 유저 닉네임 있는 경우', async () => {
        const user = await testService.createBasicUser();
        const response = await request(app.getHttpServer()).get(
          '/users/' + user.nickname + '/stats/season',
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('winRate');
        expect(response.body).toHaveProperty('wins');
        expect(response.body).toHaveProperty('ties');
        expect(response.body).toHaveProperty('loses');
      });
    });

    describe('/users/{nickname}/ranks/season', () => {
      it('라우팅 유저 닉네임 없는경우', async () => {
        const user: User = await testService.createBasicUser();
        const response = await request(app.getHttpServer()).get(
          '/users/' + user.nickname + 'noexist' + '/ranks/season',
        );
        expect(response.statusCode).not.toBe(200);
        expect(response.body).not.toHaveProperty('rank');
      });
      it('라우팅 유저 닉네임 있는 경우', async () => {
        const user = await testService.createBasicUser();
        const response = await request(app.getHttpServer()).get(
          '/users/' + user.nickname + '/ranks/season',
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('rank');
        expect(response.body).toHaveProperty('tier');
        expect(response.body).toHaveProperty('record');
      });
    });
    describe('/users/{nickname}/ranks/total', () => {
      it('라우팅 유저 닉네임 없는경우', async () => {
        const user: User = await testService.createBasicUser();
        const response = await request(app.getHttpServer()).get(
          '/users/' + user.nickname + 'noexist' + '/ranks/total',
        );
        expect(response.statusCode).not.toBe(200);
        expect(response.body).not.toHaveProperty('rank');
      });
      it('라우팅 유저 닉네임 있는 경우', async () => {
        const user = await testService.createBasicUser();
        const response = await request(app.getHttpServer()).get(
          '/users/' + user.nickname + '/ranks/total',
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('rank');
        expect(response.body).toHaveProperty('tier');
        expect(response.body).toHaveProperty('record');
      });
    });
  });
});
