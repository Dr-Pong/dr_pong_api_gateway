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

describe('GatewayFriendRelationController', () => {
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

  describe('ROUTE FRIENDS TEST', () => {
    describe('GET /users/friends', () => {
      it('[Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .get('/users/friends')
          .set({
            Authorization: `no Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(401);
      });
      it('[Valid Case] 성공', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .get('/users/friends')
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(200);
      });
    });

    describe('POST /users/friend/pendings/:nickname', () => {
      it('[Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .post(`/users/friends/pendings/${user.nickname}`)
          .set({
            Authorization: `no Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(401);
      });
      it('[Valid Case] 성공', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .post(`/users/friends/pendings/${user.nickname}`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(201);
      });
    });

    describe('GET /users/friends/pendings', () => {
      it('[Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .get('/users/friends/pendings')
          .set({
            Authorization: `no Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(401);
      });
      it('[Valid Case] 성공', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .get('/users/friends/pendings')
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(200);
      });
    });

    describe('POST /users/friends/:nickname', () => {
      it('[Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .post(`/users/friends/${user.nickname}`)
          .set({
            Authorization: `no Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(401);
      });
      it('[Valid Case] 성공', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .post(`/users/friends/${user.nickname}`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(201);
      });
    });

    describe('DELETE /users/friends/pendings/:nickname', () => {
      it('[Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .delete(`/users/friends/pendings/${user.nickname}`)
          .set({
            Authorization: `no Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(401);
      });
      it('[Valid Case] 성공', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .delete(`/users/friends/pendings/${user.nickname}`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(200);
      });
    });

    describe('DELETE /users/friends/:nickname', () => {
      it('[Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .delete(`/users/friends/${user.nickname}`)
          .set({
            Authorization: `no Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(401);
      });
      it('[Valid Case] 성공', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .delete(`/users/friends/${user.nickname}`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(200);
      });
    });
  });
});
