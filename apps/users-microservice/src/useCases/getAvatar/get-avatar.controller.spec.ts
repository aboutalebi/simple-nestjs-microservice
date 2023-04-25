import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { GetAvatarController } from './get-avatar.controller';
import { GetAvatarUseCase } from './get-avatar.useCase';
import { of } from 'rxjs';

const userID = '642bfa9acef29e33d3609487';
const mockBase64Image = 'bas64';

const mockFilesServiceSendFunc = jest
  .fn()
  .mockImplementation(() => of(mockBase64Image));

describe('GetAvatarController', () => {
  let getAvatarController: GetAvatarController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        GetAvatarUseCase,
        {
          provide: 'FILES_MICROSERVICE',
          useValue: {
            emit: jest.fn(),
            send: mockFilesServiceSendFunc,
          },
        },
      ],
      controllers: [GetAvatarController],
    }).compile();

    getAvatarController = module.get<GetAvatarController>(GetAvatarController);
  });

  it('should be defined', () => {
    expect(getAvatarController).toBeDefined();
  });

  describe('GetAvatar', () => {
    it('should return base64 avatar', async () => {
      const base64Avatar = await getAvatarController.executeImpl(userID);
      expect(mockFilesServiceSendFunc).toHaveBeenCalled();
      expect(base64Avatar).toBe(mockBase64Image);
    });
  });
});
