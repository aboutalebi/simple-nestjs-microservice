import { CreateUserUseCase } from './create-user.useCase';
import { CreateUserDTO } from './create-user.dto';
import { Controller, ValidationPipe } from '@nestjs/common';
import { BaseController } from '@payever-microservices/core/infra/base.controller';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AccountAlreadyExists } from './errors';
import { UnexpectedError } from '@payever-microservices/core/logic/genericAppError';

@Controller('/api')
export class CreateUserController extends BaseController {
  constructor(private readonly useCase: CreateUserUseCase) {
    super();
  }

  @MessagePattern('create_user')
  async executeImpl(@Payload(ValidationPipe) createUserDTO: CreateUserDTO) {
    const result = await this.useCase.execute(createUserDTO);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case AccountAlreadyExists:
          return this.conflict(error.errorValue().message);
        case UnexpectedError:
          return this.fail(error.errorValue().message);
        default:
          return this.clientError(error.errorValue().message);
      }
    }

    return null;
  }
}
