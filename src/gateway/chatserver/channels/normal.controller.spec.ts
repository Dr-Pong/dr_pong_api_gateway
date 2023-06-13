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
import { ChannelPatchRequestDto } from './dtos/channel-patch-request.dto';

describe('GatewayChannelNormalController', () => {
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

  describe('ROUTE CHAT NORMAL TEST', () => {
    describe('GET /channels', () => {
      it('[Valid Case] 성공 ', async () => {
        const page = '1';
        const count = 10;
        const orderBy = 'resent';
        const keyword = null;
        const response = await request(app.getHttpServer()).get(
          `/channels?page=${page}&count=${count}&order=${orderBy}&keyword=${keyword}`,
        );
        expect(response.statusCode).toBe(200);
      });
    });

    describe('GET /channels/:roomId/participants', () => {
      it('[Gateway Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1';
        const response = await request(app.getHttpServer())
          .get(`/channels/${roomId}/participants`)
          .set({
            Authorization: `no Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(401);
      });
      it('[Chat Server Error Case] 채팅 서버에서 주는 에러 받기', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1123123123';
        const response = await request(app.getHttpServer())
          .get(`/channels/${roomId}/participants`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        console.log(response.body);
        expect(response.statusCode).toBe(404);
      });
      it('[Valid Case] 성공', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1';
        const response = await request(app.getHttpServer())
          .get(`/channels/${roomId}/participants`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(200);
      });
    });

    describe('POST /channels', () => {
      it('[Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .post(`/channels`)
          .set({
            Authorization: `no Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(401);
      });
      it('[Error Case] dto 조건 에러', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '112312312';
        const response = await request(app.getHttpServer())
          .post(`/channels`)
          .send({ title: 'test', access: 'public', maxCount: 'string' })
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        console.log(response.body);
        expect(response.statusCode).toBe(400);
      });
      it('[Error Case] 채팅서버 에서 주는 에러반환 예) 타이틀중복', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .post(`/channels`)
          .send({ title: 'test', access: 'public', maxCount: 10 })
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(400);
      });
      it('[Valid Case] 정상요청', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .post(`/channels`)
          .send({ title: 'test1', access: 'public', maxCount: 10 })
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(201);
      });
    });

    describe('POST channels/:roomId/participants', () => {
      it('[Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1';
        const response = await request(app.getHttpServer())
          .post(`/channels/${roomId}/participants`)
          .send({ password: 'test' })
          .set({
            Authorization: `no Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(401);
      });
      it('[Error Case] 서버에서 주는 에러 반환', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1123123123';
        const response = await request(app.getHttpServer())
          .post(`/channels/${roomId}/participants`)
          .send({ password: 'test' })
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(400);
      });
      it('[Valid Case] 정상요청', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1';
        const response = await request(app.getHttpServer())
          .post(`/channels/${roomId}/participants`)
          .send({ password: 'test' })
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(201);
      });
    });

    describe('DELETE /channels/:roomId/participants', () => {
      it('[Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1';
        const response = await request(app.getHttpServer())
          .delete(`/channels/${roomId}/participants`)
          .set({
            Authorization: `no Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(401);
      });
      it('[Error Case] 채팅서버에서 주는 에러 반환', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '12312312312';
        const response = await request(app.getHttpServer())
          .delete(`/channels/${roomId}/participants`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(400);
      });
      it('[Valid Case] 성공', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1';
        const response = await request(app.getHttpServer())
          .delete(`/channels/${roomId}/participants`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(200);
      });
    });

    describe('POST /channels/:roomId/invitation/:nickname', () => {
      it('[Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1';
        const response = await request(app.getHttpServer())
          .delete(`/channels/${roomId}/invitation/${user.nickname}`)
          .set({
            Authorization: `no Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(401);
      });
      it('[Error Case] 채팅서버에서 주는 에러 반환', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '12312312312';
        const response = await request(app.getHttpServer())
          .delete(`/channels/${roomId}/invitation/${user.nickname}`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(400);
      });
      it('[Valid Case] 성공', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1';
        const response = await request(app.getHttpServer())
          .delete(`/channels/${roomId}/invitation/${user.nickname}`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(201);
      });
    });

    describe('POST /channels/:roomId/magicpass', () => {
      it('[Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1';
        const response = await request(app.getHttpServer())
          .post(`/channels/${roomId}/magicpass`)
          .set({
            Authorization: `no Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(401);
      });
      it('[Error Case] 채팅서버에서 주는 에러 반환', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '12312312312';
        const response = await request(app.getHttpServer())
          .post(`/channels/${roomId}/magicpass`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(400);
      });
      it('[Valid Case] 성공', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1';
        const response = await request(app.getHttpServer())
          .post(`/channels/${roomId}/magicpass`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(201);
      });
    });

    describe('DELETE /channels/:roomId/mute/:nickname', () => {
      it('[Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1';
        const response = await request(app.getHttpServer())
          .delete(`/channels/${roomId}/mute/${user.nickname}`)
          .set({
            Authorization: `no Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(401);
      });
      it('[Error Case] 채팅서버에서 주는 에러 반환', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '12312312312';
        const response = await request(app.getHttpServer())
          .delete(`/channels/${roomId}/mute/${user.nickname}`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(400);
      });
      it('[Valid Case] 성공', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1';
        const response = await request(app.getHttpServer())
          .delete(`/channels/${roomId}/mute/${user.nickname}`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(200);
      });
    });
  });
});
