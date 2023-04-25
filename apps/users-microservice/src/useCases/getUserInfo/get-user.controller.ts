import { Controller, ValidationPipe } from '@nestjs/common';
import { BaseController } from '@payever-microservices/core/infra/base.controller';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetUserUseCase } from './get-user.useCase';
import { UnexpectedError } from '@payever-microservices/core/logic/genericAppError';

@Controller()
export class GetUserController extends BaseController {
  constructor(private readonly useCase: GetUserUseCase) {
    super();
  }

  @MessagePattern('get_user')
  async executeImpl(@Payload(ValidationPipe) userID: number): Promise<any> {
    const result = await this.useCase.execute(userID);

    if (result.isRight()) {
      return result.value.getValue().props;
    } else {
      const error = result.value;

      switch (error.constructor) {
        case UnexpectedError:
          return this.fail(error.errorValue().message);
        default:
          return this.clientError(error.errorValue().message);
      }
    }
  }
}
