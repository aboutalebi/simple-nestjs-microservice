import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDTO } from './create-user.dto';
import { HttpModule } from '@nestjs/axios';
import { CreateUserController } from './create-user.controller';
import { CreateUserUseCase } from './create-user.useCase';
import { UserCreatedEvent } from '../../events/user-created.event';
import { RpcException } from '@nestjs/microservices';

const mockCreateUserDTO = (
  name = 'HamidReza',
  familyName = 'Aboutalebi',
  emailAddress = 'hamid@test.com',
  password = '!Q@W#E$R1q',
): CreateUserDTO => ({
  name,
  familyName,
  emailAddress,
  password,
});

const mockInvalidPasswordCreateUserDTO = (
  name = 'HamidReza',
  familyName = 'Aboutalebi',
  emailAddress = 'hamid@test.com',
  password = '1234',
): CreateUserDTO => ({
  name,
  familyName,
  emailAddress,
  password,
});

const mockRepoCreateFunc = jest.fn();
const mockCreatedUserEvent = jest.fn();
const mockSendMailFunc = jest.fn();

describe('CreateUserController', () => {
  let createUserController: CreateUserController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        CreateUserUseCase,
        UserCreatedEvent,
        {
          provide: 'UserRepo',
          useValue: {
            findById: jest.fn(),
            exists: jest.fn(),
            create: mockRepoCreateFunc,
          },
        },
        {
          provide: 'MAILER_MICROSERVICE',
          useValue: {
            emit: mockSendMailFunc,
            send: jest.fn(),
          },
        },
        {
          provide: 'USERS_MICROSERVICE',
          useValue: {
            emit: mockCreatedUserEvent,
            send: jest.fn(),
          },
        },
      ],
      controllers: [CreateUserController],
    }).compile();

    createUserController =
      module.get<CreateUserController>(CreateUserController);
  });

  it('should be defined', () => {
    expect(createUserController).toBeDefined();
  });

  describe('Create User', () => {
    it('Should Return Without Error & Call Event And Send Mail', async () => {
      await createUserController.executeImpl(mockCreateUserDTO());
      expect(mockRepoCreateFunc).toHaveBeenCalled();
      expect(mockCreatedUserEvent).toHaveBeenCalled();
      expect(mockSendMailFunc).toHaveBeenCalled();
    });

    it('should return failed for password invalid', async () => {
      await expect(
        createUserController.executeImpl(mockInvalidPasswordCreateUserDTO()),
      ).rejects.toThrow(RpcException);
    });
  });
});
