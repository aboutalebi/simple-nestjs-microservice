import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { of } from 'rxjs';
import { DeleteAvatarController } from './delete-avatar.controller';
import { DeleteAvatarUseCase } from './delete-avatar.useCase';

const userID = '642bfa9acef29e33d3609487';

const mockFilesServiceSendFunc = jest.fn().mockImplementation(() => of(null));

describe('DeleteAvatarController', () => {
  let deleteAvatarController: DeleteAvatarController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        DeleteAvatarUseCase,
        {
          provide: 'FILES_MICROSERVICE',
          useValue: {
            emit: jest.fn(),
            send: mockFilesServiceSendFunc,
          },
        },
      ],
      controllers: [DeleteAvatarController],
    }).compile();

    deleteAvatarController = module.get<DeleteAvatarController>(
      DeleteAvatarController,
    );
  });

  it('should be defined', () => {
    expect(deleteAvatarController).toBeDefined();
  });

  describe('GetAvatar', () => {
    it('should run without error', async () => {
      await deleteAvatarController.executeImpl(userID);
      expect(mockFilesServiceSendFunc).toHaveBeenCalled();
    });
  });
});
