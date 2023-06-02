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
import { JwtStrategy } from 'src/auth/jwt/auth.jwt.strategy';
import { JwtService } from '@nestjs/jwt';

describe('GatewayController', () => {
  let app: INestApplication;
  let testService: TestService;
  let dataSources: DataSource;
  let jwtStrategy: JwtStrategy;
  let jwtService: JwtService;

  initializeTransactionalContext();
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    jwtStrategy = moduleFixture.get<JwtStrategy>(JwtStrategy);
    jwtService = moduleFixture.get<JwtService>(JwtService);
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
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .patch('/users/' + user.nickname + '/title')
          .set({ Authorization: `Bearer ${token}` })
          .send({ id: 1 });
        expect(response.statusCode).toBe(202);
      });
      it('라우팅 실패했을때 : 해당 서버에서 보내는 에러일때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .patch('/users/' + user.nickname + '/title')
          .set({ Authorization: `Bearer ${token}` })
          .send({ id: 128937 });
        expect(response.statusCode).not.toBe(202);
      });
      it('라우팅 실패했을때 : ValidatePipe 걸렸을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .patch('/users/' + user.nickname + '/title')
          .set({ Authorization: `Bearer ${token}` })
          .send({ id: -1 });
        expect(response.statusCode).toBe(400);
      });
      it('라우팅 실패했을때 : jwt가드에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = 'worng token';
        const response = await request(app.getHttpServer())
          .patch('/users/' + user.nickname + '/title')
          .set({ Authorization: `Bearer ${token}` })
          .send({ id: -1 });
        expect(response.statusCode).toBe(401);
      });
    });

    describe('/:nickname/image', () => {
      it('라우팅 성공 했을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .patch('/users/' + user.nickname + '/image')
          .set({ Authorization: `Bearer ${token}` })
          .send({ id: 1 });
        expect(response.statusCode).toBe(202);
      });
      it('라우팅 실패했을때 : 서버에서 주는 에러 그래로 반환', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .patch('/users/' + user.nickname + '/image')
          .set({ Authorization: `Bearer ${token}` })
          .send({ id: 128937 });
        expect(response.statusCode).not.toBe(202);
      });
      it('라우팅 실패했을때 : ValidatePipe 걸렸을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .patch('/users/' + user.nickname + '/image')
          .set({ Authorization: `Bearer ${token}` })
          .send({ id: -1 });
        expect(response.statusCode).toBe(400);
      });
      it('라우팅 실패했을때 : jwt가드에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = 'worng token';
        const response = await request(app.getHttpServer())
          .patch('/users/' + user.nickname + '/image')
          .set({ Authorization: `Bearer ${token}` })
          .send({ id: '2' });
        expect(response.statusCode).toBe(401);
      });
    });

    describe('/:nickname/message', () => {
      it('라우팅 성공 했을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .patch('/users/' + user.nickname + '/message')
          .set({ Authorization: `Bearer ${token}` })
          .send({ message: 'test message' });
        expect(response.statusCode).toBe(202);
      });
      it('라우팅 실패했을때 : 서버에서 주는 에러 그대로 : 없는 닉네임일때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .patch('/users/' + user.nickname + 'noexist' + '/message')
          .set({ Authorization: `Bearer ${token}` })
          .send({ message: 'test message' });
        expect(response.statusCode).toBe(404);
      });
      it('라우팅 실패했을때 : ValidatePipe 걸렸을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .patch('/users/' + user.nickname + '/message')
          .set({ Authorization: `Bearer ${token}` })
          .send({ message: 1 });
        expect(response.statusCode).toBe(400);
      });
      it('라우팅 실패했을때 : jwt가드에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = 'worng token';
        const response = await request(app.getHttpServer())
          .patch('/users/' + user.nickname + '/message')
          .set({ Authorization: `Bearer ${token}` })
          .send({ message: 'test message' });
        expect(response.statusCode).toBe(401);
      });
    });
    describe('/:nickname/achievements', () => {
      it('라우팅 성공 했을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .patch('/users/' + user.nickname + '/achievements')
          .set({ Authorization: `Bearer ${token}` })
          .send({ ids: [1, 2, 3] });
        expect(response.statusCode).toBe(202);
      });
      it('라우팅 실패했을때 : 서버에서 주는 에러 그대로 반환', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .patch('/users/' + user.nickname + '/achievements')
          .set({ Authorization: `Bearer ${token}` })
          .send({ ids: [128937, 2, 3] });
        expect(response.statusCode).not.toBe(202);
      });
      it('라우팅 실패했을때 : ValidatePipe 걸렸을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .patch('/users/' + user.nickname + '/achievements')
          .set({ Authorization: `Bearer ${token}` })
          .send({ ids: 'string' });
        expect(response.statusCode).toBe(400);
      });
      it('라우팅 실패했을때 : jwt가드에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = 'worng token';
        const response = await request(app.getHttpServer())
          .patch('/users/' + user.nickname + '/achievements')
          .set({ Authorization: `Bearer ${token}` })
          .send({ ids: [1, 2, 3] });
        expect(response.statusCode).toBe(401);
      });
    });
    describe('/:nickname/emojis', () => {
      it('라우팅 성공 했을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .patch('/users/' + user.nickname + '/emojis')
          .set({ Authorization: `Bearer ${token}` })
          .send({ ids: [1, 2, 3, 4] });
        expect(response.statusCode).toBe(202);
      });
      it('라우팅 실패했을때 : 서버에서 주는 에러 그대로 반환', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .patch('/users/' + user.nickname + '/emojis')
          .set({ Authorization: `Bearer ${token}` })
          .send({ ids: [128937, 2, 3, 2] });
        expect(response.statusCode).not.toBe(202);
      });
      it('라우팅 실패했을때 : ValidatePipe 걸렸을때', async () => {
        const user = await testService.createBasicUser();
        const token = await testService.giveTokenToUser(user);
        const response = await request(app.getHttpServer())
          .patch('/users/' + user.nickname + '/emojis')
          .set({ Authorization: `Bearer ${token}` })
          .send({ ids: 'string' });
        expect(response.statusCode).toBe(400);
      });
      it('라우팅 실패했을때 : jwt가드에 막혔을때', async () => {
        const user = await testService.createBasicUser();
        const token = 'worng token';
        const response = await request(app.getHttpServer())
          .patch('/users/' + user.nickname + '/emojis')
          .set({ Authorization: `Bearer ${token}` })
          .send({ ids: [1, 2, 3, 4] });
        expect(response.statusCode).toBe(401);
      });
    });
  });
});
