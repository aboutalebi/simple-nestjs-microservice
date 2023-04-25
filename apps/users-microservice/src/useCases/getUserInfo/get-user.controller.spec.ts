import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { GetUserController } from './get-user.controller';
import { GetUserUseCase } from './get-user.useCase';

describe('GetUserController', () => {
  let getUserController: GetUserController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [GetUserUseCase],
      controllers: [GetUserController],
    }).compile();

    getUserController = module.get<GetUserController>(GetUserController);
  });

  it('should be defined', () => {
    expect(getUserController).toBeDefined();
  });

  describe('getUser', () => {
    it('should return the user`s info', async () => {
      const userInfo = await getUserController.executeImpl(1);
      expect(userInfo.name).toBe('George');
    });
  });
});
