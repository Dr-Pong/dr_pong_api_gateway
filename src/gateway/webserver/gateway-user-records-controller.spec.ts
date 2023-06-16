import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';
import { TestService } from 'src/test/test.service';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { User } from 'src/user/user.entity';

describe('RecordsController', () => {
  let app: INestApplication;
  let dataSources: DataSource;
  let testService: TestService;
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

  afterEach(async () => {
    testService.clear();
    jest.resetAllMocks();
    await dataSources.synchronize(true);
  });
  describe('ROUTE RECORDS GET TEST', () => {
    describe('/users/{nickname}/records?count={count}&lastGameId={lastGameId}', () => {
      it('count 인자가 없을때 lastGameId도 없을때 default로 설정', async () => {
        const user: User = await testService.createBasicUser();
        const response = await request(app.getHttpServer()).get(
          '/users/' + user.nickname + '/records',
        );
        expect(response.statusCode).toBe(200);
      });
      it('count, lastGameId 둘다 정상일때', async () => {
        const user: User = await testService.createBasicUser();
        const count = 12;
        const lastGameId = 1;
        const response = await request(app.getHttpServer()).get(
          '/users/' +
            user.nickname +
            '/records?count=' +
            count +
            '&lastGameId=' +
            lastGameId,
        );
        expect(response.statusCode).toBe(200);
      });
      it('error : count 쿼리 인자가 있는데 최대값 이상에 걸릴때 ', async () => {
        const user: User = await testService.createBasicUser();
        const count = 1000;
        const lastGameId = 0;
        const response = await request(app.getHttpServer()).get(
          '/users/' +
            user.nickname +
            '/records?count=' +
            count +
            '&lastGameId=' +
            lastGameId,
        );
        expect(response.statusCode).toBe(400);
      });
    });

    describe('/users/{nickname}/records/{gameId}', () => {
      it('정상 작동할겨우', async () => {
        const user: User = await testService.createBasicUser();
        const gameId = 1;
        const response = await request(app.getHttpServer()).get(
          '/users/' + user.nickname + '/records/' + gameId,
        );
        expect(response.statusCode).toBe(200);
      });
      it('error: nickname 이 없는경우', async () => {
        const gameId = 1;
        const response = await request(app.getHttpServer()).get(
          '/users/' + 'nouser' + '/records/' + gameId,
        );
        expect(response.status).toBe(404);
      });
      it('error: gmaeId 가 음수일 경우', async () => {
        const user: User = await testService.createBasicUser();
        const gameId = -1;
        const response = await request(app.getHttpServer()).get(
          '/users/' + user.nickname + '/records/' + gameId,
        );
        expect(response.status).toBe(400);
      });
      it('error: gmaeId 가 문자열일 경우', async () => {
        const user: User = await testService.createBasicUser();
        const gameId = 'a';
        const response = await request(app.getHttpServer()).get(
          '/users/' + user.nickname + '/records/' + gameId,
        );
        expect(response.status).toBe(400);
      });
    });
  });
});
