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
    app.useGlobalPipes(new ValidationPipe());
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
  // patch test 요청시 header에 추가
  describe('ROUTE USER PATCH TEST', () => {
    describe('/:nickname/title', () => {
      it('라우팅 성공 했을때', async () => {
        const user = await testService.createBasicUser();
        const response = await request(app.getHttpServer())
          .get('/users/' + user.nickname + '/title')
          .send({ id: 1 });
        expect(response.statusCode).toBe(202);
      });
      it('라우팅 실패했을때 : 없는 title id 요청시', async () => {
        const user = await testService.createBasicUser();
        const response = await request(app.getHttpServer())
          .get('/users/' + user.nickname + '/title')
          .send({ id: 128937 });
        expect(response.statusCode).toBe(404);
      });
      it('라우팅 실패했을때 : ValidatePipe 걸렸을때', async () => {
        const user = await testService.createBasicUser();
        const response = await request(app.getHttpServer())
          .get('/users/' + user.nickname + '/title')
          .send({ id: -1 });
        expect(response.statusCode).toBe(400);
      });
    });

    describe('/:nickname/image', () => {
      it('라우팅 성공 했을때', async () => {
        const user = await testService.createBasicUser();
        const response = await request(app.getHttpServer())
          .get('/users/' + user.nickname + '/image')
          .send({ id: 1 });
        expect(response.statusCode).toBe(202);
      });
      it('라우팅 실패했을때 : 없는 이미지 id 요청시', async () => {
        const user = await testService.createBasicUser();
        const response = await request(app.getHttpServer())
          .get('/users/' + user.nickname + '/image')
          .send({ id: 128937 });
        expect(response.statusCode).toBe(404);
      });
      it('라우팅 실패했을때 : ValidatePipe 걸렸을때', async () => {
        const user = await testService.createBasicUser();
        const response = await request(app.getHttpServer())
          .get('/users/' + user.nickname + '/image')
          .send({ id: -1 });
        expect(response.statusCode).toBe(400);
      });
    });

    describe('/:nickname/message', () => {
      it('라우팅 성공 했을때', async () => {
        const user = await testService.createBasicUser();
        const response = await request(app.getHttpServer())
          .get('/users/' + user.nickname + '/message')
          .send({ id: 1 });
        expect(response.statusCode).toBe(202);
      });
      it('라우팅 실패했을때 : 없는 유저 id 요청시', async () => {
        const user = await testService.createBasicUser();
        const response = await request(app.getHttpServer())
          .get('/users/' + user.nickname + '/message')
          .send({ id: 128937 });
        expect(response.statusCode).toBe(404);
      });
      it('라우팅 실패했을때 : ValidatePipe 걸렸을때', async () => {
        const user = await testService.createBasicUser();
        const response = await request(app.getHttpServer())
          .get('/users/' + user.nickname + '/message')
          .send({ message: null });
        expect(response.statusCode).toBe(400);
      });
    });
    describe('/:nickname/achievements', () => {
      it('라우팅 성공 했을때', async () => {
        const user = await testService.createBasicUser();
        const response = await request(app.getHttpServer())
          .get('/users/' + user.nickname + '/achievements')
          .send({ id: 1 });
        expect(response.statusCode).toBe(202);
      });
      it('라우팅 실패했을때 : 없는 유저 id 요청시', async () => {
        const user = await testService.createBasicUser();
        const response = await request(app.getHttpServer())
          .get('/users/' + user.nickname + '/achievements')
          .send({ id: 128937 });
        expect(response.statusCode).toBe(404);
      });
      it('라우팅 실패했을때 : ValidatePipe 걸렸을때', async () => {
        const user = await testService.createBasicUser();
        const response = await request(app.getHttpServer())
          .get('/users/' + user.nickname + '/achievements')
          .send({ id: 'string' });
        expect(response.statusCode).toBe(400);
      });
    });
    describe.only('/:nickname/emojis', () => {
      it('라우팅 성공 했을때', async () => {
        const user = await testService.createBasicUser();
        const response = await request(app.getHttpServer())
          .get('/users/' + user.nickname + '/emojis')
          .send({ id: 1 });
        expect(response.statusCode).toBe(202);
      });
      it('라우팅 실패했을때 : 없는 유저 id 요청시', async () => {
        const user = await testService.createBasicUser();
        const response = await request(app.getHttpServer())
          .get('/users/' + user.nickname + '/emojis')
          .send({ id: 128937 });
        expect(response.statusCode).toBe(404);
      });
      it('라우팅 실패했을때 : ValidatePipe 걸렸을때', async () => {
        const user = await testService.createBasicUser();
        const response = await request(app.getHttpServer())
          .get('/users/' + user.nickname + '/emojis')
          .send({ id: 'string' });
        expect(response.statusCode).toBe(400);
      });
      // it('Patch body에 null 들어갔을때')
    });
  });
});
