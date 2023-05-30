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

  describe('ROUTE USER GET TEST', () => {
    describe('/users/{nickname}/achievements?selected=true', () => {
      it('라우팅 유저 닉네임 없는 경우', async () => {
        const user: User = await testService.createBasicUser();
        const response = await request(app.getHttpServer()).get(
          '/users/' + user.nickname + 'noexist' + '/achievements?selected=true',
        );
        expect(response.statusCode).not.toBe(200);
        expect(response.body).not.toHaveProperty('achievements');
        // expect(response.body.message).toBe('No such User');
      });
      it('라우팅 유저 닉네임 있는 경우', async () => {
        const user = await testService.createBasicUser();
        const response = await request(app.getHttpServer()).get(
          '/users/' + user.nickname + '/achievements?selected=true',
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('achievements');
      });
    });

    describe('/users/{nickname}/emojis?selected=true', () => {
      it('라우팅 유저 닉네임 없는 경우', async () => {
        const user: User = await testService.createBasicUser();
        const response = await request(app.getHttpServer()).get(
          '/users/' + user.nickname + 'noexist' + '/emojis?selected=true',
        );

        expect(response.statusCode).not.toBe(200);
        expect(response.body).not.toHaveProperty('emojis');
        // expect(response.body.message).toBe('No such User');
      });
      it('라우팅 유저 닉네임 있는 경우', async () => {
        const user = await testService.createBasicUser();
        const response = await request(app.getHttpServer()).get(
          '/users/' + user.nickname + '/emojis?selected=true',
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('emojis');
      });
    });

    describe('/users/{nickname}/titles', () => {
      it('라우팅 유저 닉네임 없는경우', async () => {
        const user: User = await testService.createBasicUser();
        const response = await request(app.getHttpServer()).get(
          '/users/' + user.nickname + 'noexist' + '/titles',
        );
        expect(response.statusCode).not.toBe(200);
        expect(response.body).not.toHaveProperty('titles');
      });
      it('라우팅 유저 닉네임 있는 경우', async () => {
        const user = await testService.createBasicUser();
        const response = await request(app.getHttpServer()).get(
          '/users/' + user.nickname + '/titles',
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('titles');
      });
    });
    // 현재 web-server에 이 함수 없음 컨트롤러만
    describe('/users/images', () => {
      it('라우팅 성공 했을때', async () => {
        const response = await request(app.getHttpServer()).get(
          '/users/images',
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('url');
      });
    });
  });
});
