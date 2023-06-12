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

describe('GatewayChannelAdminController', () => {
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

  describe('ROUTE CHAT ADMIN TEST', () => {
    describe('PATCH /channels/:roomId', () => {
      it('[Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1';
        const patchRequestDto: ChannelPatchRequestDto =
          ChannelPatchRequestDto.default('public', '123');
        const response = await request(app.getHttpServer())
          .patch(`/channels/${roomId}`)
          .send(patchRequestDto)
          .set({
            Authorization: `no Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(401);
      });
      it('[Error Case] validate decoreator 에서 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1';
        const response = await request(app.getHttpServer())
          .patch(`/channels/${roomId}`)
          .send({ access: 'private', password: 123 })
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(400);
      });
      it('[Error Case] 서버에서 주는 에러 받는경우', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const patchRequestDto: ChannelPatchRequestDto =
          ChannelPatchRequestDto.default('public', '123');
        const roomId = '12312322212';
        const response = await request(app.getHttpServer())
          .patch(`/channels/${roomId}`)
          .send(patchRequestDto)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(404);
      });
      it('[Valid Case] 정상 요청', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const patchRequestDto: ChannelPatchRequestDto =
          ChannelPatchRequestDto.default('public', '123');
        const roomId = '1';
        const response = await request(app.getHttpServer())
          .patch(`/channels/${roomId}`)
          .send(patchRequestDto)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(200);
      });
    });

    describe('DELETE /channels/:roomId', () => {
      it('[Gateway Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1';
        const response = await request(app.getHttpServer())
          .delete(`/channels/${roomId}`)
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
          .delete(`/channels/${roomId}`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(404);
      });
      it('[Valid Case] 성공', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1';
        const response = await request(app.getHttpServer())
          .delete(`/channels/${roomId}`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(200);
      });
    });

    describe('POST /channels/:roomId/admin/:nickname', () => {
      it('[Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1';
        const response = await request(app.getHttpServer())
          .post(`/channels/${roomId}/admin/${user.nickname}`)
          .set({
            Authorization: `no Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(401);
      });
      it('[Error Case] 채팅서버 에서 주는 에러반환', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '112312312';
        const response = await request(app.getHttpServer())
          .post(`/channels/${roomId}/admin/${user.nickname}`)
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
          .post(`/channels/${roomId}/admin/${user.nickname}`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(201);
      });
    });

    describe('DELETE channels/:roomId/admin/:nickname', () => {
      it('[Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1';
        const response = await request(app.getHttpServer())
          .delete(`/channels/${roomId}/admin/${user.nickname}`)
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
          .delete(`/channels/${roomId}/admin/${user.nickname}`)
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
          .delete(`/channels/${roomId}/admin/${user.nickname}`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(200);
      });
    });

    describe('POST /channels/:roomId/ban/:nickname', () => {
      it('[Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1';
        const response = await request(app.getHttpServer())
          .post(`/channels/${roomId}/ban/${user.nickname}`)
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
          .post(`/channels/${roomId}/ban/${user.nickname}`)
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
          .post(`/channels/${roomId}/ban/${user.nickname}`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(201);
      });
    });
    describe('DELETE /channels/:roomId/kick/:nickname', () => {
      it('[Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1';
        const response = await request(app.getHttpServer())
          .delete(`/channels/${roomId}/kick/${user.nickname}`)
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
          .delete(`/channels/${roomId}/kick/${user.nickname}`)
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
          .post(`/channels/${roomId}/kick/${user.nickname}`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(200);
      });
    });
    describe('POST /channels/:roomId/mute/:nickname', () => {
      it('[Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const roomId = '1';
        const response = await request(app.getHttpServer())
          .post(`/channels/${roomId}/mute/${user.nickname}`)
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
          .post(`/channels/${roomId}/mute/${user.nickname}`)
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
          .post(`/channels/${roomId}/mute/${user.nickname}`)
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
