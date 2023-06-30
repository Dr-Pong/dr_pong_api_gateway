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

describe('GatewayGameController', () => {
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

  describe('ROUTE GAMESEVER GAME TEST', () => {
    describe('POST /games/invitation/:nickname', () => {
      it('[Valid Case] 성공 ', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .post(`/games/invitation/${user.nickname}`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          })
          .send({ mode: 'classic' });
        expect(response.statusCode).toBe(201);
      });
      it('[Gateway Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .post(`/games/invitation/${user.nickname}`)
          .set({
            Authorization: `no Bearer ${token}`,
            withCredentials: true,
          })
          .send({ mode: 'classic' });
        expect(response.statusCode).toBe(401);
      });
      it('[Game Server Error Case] 채팅 서버에서 주는 에러 받기', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .post(`/games/invitation/nouser}`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          })
          .send({ mode: 'classic' });
        console.log(response.body);
        expect(response.statusCode).toBe(404);
      });
    });

    describe('Delete /games/invitaion', () => {
      it('[Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .delete(`/games/invitation`)
          .set({
            Authorization: `no Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(401);
      });
    //   it('[Error Case] 게임서버 에서 주는 에러반환', async () => {
    //     const user = await testService.createBasicUser();
    //     const token = await testService.giveTokenToUser(user);
    //     const response = await request(app.getHttpServer())
    //       .delete(`/games/invitation`)
    //       .set({
    //         Authorization: `Bearer ${token}`,
    //         withCredentials: true,
    //       });
    //     expect(response.statusCode).toBe(400);
    //   });
      it('[Valid Case] 정상요청', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .delete(`/games/invitation`)
          .set({
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          });
        expect(response.statusCode).toBe(200);
      });
    });

    describe('PATCH /games/invitaion/:id', () => {
      it('[Error Case] jwt 가드 에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        // const id = random
        const response = await request(app.getHttpServer())
          .patch(`/games/invitation/`)
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
