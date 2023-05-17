import { Test, TestingModule } from '@nestjs/testing';
import { UserGatewayController } from './user.gateway.controller';

describe('GatewayController', () => {
  let controller: UserGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserGatewayController],
    }).compile();

    controller = module.get<UserGatewayController>(UserGatewayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
