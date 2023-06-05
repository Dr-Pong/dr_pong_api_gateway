import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
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
  describe('ROUTE RANK GET TEST', () => {
    describe('/ranks/top?count={count}', () => {
      it('count 인자가 없을때 default로 3 ', async () => {
        const response = await request(app.getHttpServer()).get('/ranks/top');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('top');
      });
      it('count 인자가 있을때 그 값으로 잘 되나', async () => {
        const topCount = 2;
        const response = await request(app.getHttpServer()).get(
          '/ranks/top?count=' + topCount,
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(3);
      });
      it('error : count 쿼리 인자가 있는데 최대값 10 이상에 걸릴때 ', async () => {
        const topCount = 100;
        const response = await request(app.getHttpServer()).get(
          '/ranks/top?count=' + topCount,
        );
        expect(response.statusCode).toBe(400);
      });
      it('error : count 쿼리 인자가 0 이하에 걸릴때 ', async () => {
        const topCount = -1;
        const response = await request(app.getHttpServer()).get(
          '/ranks/top?count=' + topCount,
        );
        expect(response.statusCode).toBe(400);
      });
    });

    describe('/ranks/bottom?count={count}&offset={offset}', () => {
      it('count & offset 인자가 없을때 default로 되는경우', async () => {
        const response = await request(app.getHttpServer()).get(
          '/ranks/bottom',
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('top');
      });
      it('offset이 없는경우', async () => {
        const bottomCount = 10;
        const response = await request(app.getHttpServer()).get(
          '/ranks/bottom?count=' + bottomCount,
        );
        expect(response.status).toBe(200);
      });
      it('count가 없는경우', async () => {
        const bottomOffset = 10;
        const response = await request(app.getHttpServer()).get(
          '/ranks/bottom?' + 'offset=' + bottomOffset,
        );
        expect(response.status).toBe(200);
      });
      it('error: count 인자가 validate 하지 않은 경우', async () => {
        const bottomCount = 'a';
        const response = await request(app.getHttpServer()).get(
          '/ranks/bottom?' + 'count=' + bottomCount + '&offset=10',
        );
        expect(response.status).toBe(400);
        // expect(response.body.message).toBe('Rank Get Query must be numeric');
      });
      it('error: offset 인자가 validate 하지 않은 경우', async () => {
        const bottomOffset = -1;
        const response = await request(app.getHttpServer()).get(
          '/ranks/bottom?' + 'count=12' + '&offset=' + bottomOffset,
        );
        expect(response.status).toBe(400);
        // expect(response.body.message).toBe('input must be greater than 0.');
      });
    });
  });
});
