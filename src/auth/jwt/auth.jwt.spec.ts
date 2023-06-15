import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../user/user.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthModule } from '../auth.module';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import {
  ROLETYPE_MEMBER,
  ROLETYPE_NONAME,
  ROLETYPE_GUEST,
} from '../../user/type.user.roletype';
import { JwtStrategy } from './auth.jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { typeORMConfig } from '../../configs/typeorm.configs';
import { TestModule } from 'src/test/test.module';
import { TestService } from 'src/test/test.service';
import { GetUserMeDto } from '../dto/get.user.me.dto';
import { AuthService } from '../auth.service';
// import { RoleType } from '../type.user.roletype';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let jwtService: JwtService;
  let userRepository: Repository<User>;
  let dataSources: DataSource;
  let testData: TestService;
  let authService: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory() {
            return typeORMConfig;
          },
          async dataSourceFactory(options) {
            if (!options) {
              throw new Error('Invalid options passed');
            }
            return addTransactionalDataSource({
              dataSource: new DataSource(options),
            });
          },
        }),
        AuthModule,
        TestModule,
      ],
      providers: [
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    dataSources = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    jest.resetAllMocks();
    await dataSources.dropDatabase();
    await dataSources.destroy();
  });

  it('정상 작동 케이스', async () => {
    const admin = await userRepository.save({
      nickname: 'admin',
      email: 'admin@email',
      imageUrl: 'admin.png',
      level: 1,
      statusMessage: 'im admin',
      roleType: 'admin',
    });
    const normalUser = await userRepository.save({
      nickname: 'normal',
      email: 'normal@email',
      imageUrl: 'normal.png',
      level: 1,
      statusMessage: 'heehee',
      roleType: 'member',
    });

    const adminToken = jwtService.sign({
      id: admin.id,
      nickname: admin.nickname,
      roleType: admin.roleType,
    });
    const normalToken = jwtService.sign({
      id: normalUser.id,
      nickname: normalUser.nickname,
      roleType: normalUser.roleType,
    });

    //find from DB
    const findedAdmin1 = await jwtStrategy.validate(
      jwtService.verify(adminToken),
    );
    const findedNormalUser1 = await jwtStrategy.validate(
      jwtService.verify(normalToken),
    );

    expect(findedAdmin1.id).toBe(admin.id);
    expect(findedNormalUser1.id).toBe(normalUser.id);
    expect(findedAdmin1.nickname).toBe(admin.nickname);
    expect(findedNormalUser1.nickname).toBe(normalUser.nickname);
    // expect(findedAdmin1.roleType).toBe(ROLETYPE_ADMIN);
    // expect(findedNormalUser1.roleType).toBe(ROLETYPE_MEMBER);

    //find from memory
    const findedAdmin2 = await jwtStrategy.validate(
      jwtService.verify(adminToken),
    );
    const findedNormalUser2 = await jwtStrategy.validate(
      jwtService.verify(normalToken),
    );

    expect(findedAdmin2.id).toBe(admin.id);
    expect(findedNormalUser2.id).toBe(normalUser.id);
    expect(findedAdmin2.nickname).toBe(admin.nickname);
    expect(findedNormalUser2.nickname).toBe(normalUser.nickname);
    // expect(findedAdmin2.roleType).toBe(ROLETYPE_ADMIN);
    // expect(findedNormalUser2.roleType).toBe(ROLETYPE_MEMBER);
  });

  it('에러 케이스', async () => {
    const normalUser = await userRepository.save({
      nickname: 'normal',
      email: 'normal@email',
      imageUrl: 'normal.png',
      level: 1,
      statusMessage: 'im normal',
      roleType: 'member',
    });
    const npc = await userRepository.save({
      nickname: 'npc',
      email: 'npc@email',
      imageUrl: 'npc.png',
      level: 1,
      statusMessage: 'im npc',
      roleType: 'member',
    });
    const noNickNameUserToken = jwtService.sign({
      id: null,
      nickname: '',
      roleType: ROLETYPE_NONAME,
    });
    const notRegisteredUserToken = jwtService.sign({
      id: -1,
      nickname: 'not Rejistered',
      roleType: normalUser.roleType,
    });
    const invaliedFormetToken = 'wrong token';
    const expiredToken = jwtService.sign(
      {
        id: normalUser.id,
        nickname: normalUser.nickname,
        roleType: normalUser.roleType,
      },
      { expiresIn: 0 },
    );

    await expect(
      jwtStrategy.validate(jwtService.verify(notRegisteredUserToken)),
    ).rejects.toThrow(new UnauthorizedException());
    await expect(
      jwtStrategy.validate(jwtService.verify(noNickNameUserToken)),
    ).rejects.toThrow(new UnauthorizedException());
    // await expect(jwtStrategy.validate(jwtService.verify(invaliedFormetToken))).rejects.toThrow();
    // await expect(jwtStrategy.validate(jwtService.verify(expiredToken))).rejects.toThrow(new UnauthorizedException()); // error cases
  });

  it('User Me Get Service 테스트', async () => {
    await testData.createProfileImages();
    const basicUser: User = await testData.createBasicUser();

    const validToken: string = jwtService.sign({
      id: basicUser.id,
      nickname: basicUser.nickname,
      // roleType: basicUser.roleType,
    });

    const nonameToken: string = jwtService.sign({
      id: null,
      nickname: '',
      roleType: ROLETYPE_NONAME,
    });

    const basicDto: GetUserMeDto = {
      token: validToken,
    };

    const nonameDto: GetUserMeDto = {
      token: nonameToken,
    };

    const guestDto: GetUserMeDto = {
      token: null,
    };

    const basicCase = await authService.getUserMe(basicDto);
    const nonameCase = await authService.getUserMe(nonameDto);
    const guestCase = await authService.getUserMe(guestDto);

    expect(basicCase.nickname).toBe(basicUser.nickname);
    expect(basicCase.imgUrl).toBe(basicUser.image.url);
    expect(basicCase.isSecondAuthOn).toBe(false);
    expect(basicCase.roleType).toBe(ROLETYPE_MEMBER);

    expect(nonameCase.nickname).toBe('');
    expect(nonameCase.imgUrl).toBe('');
    expect(nonameCase.isSecondAuthOn).toBe(false);
    expect(nonameCase.roleType).toBe(ROLETYPE_NONAME);

    expect(guestCase.nickname).toBe('');
    expect(guestCase.imgUrl).toBe('');
    expect(guestCase.isSecondAuthOn).toBe(false);
    expect(guestCase.roleType).toBe(ROLETYPE_GUEST);
  });
});
