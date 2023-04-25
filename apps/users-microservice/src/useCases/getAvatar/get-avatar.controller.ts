import { Controller, ValidationPipe } from '@nestjs/common';
import { BaseController } from '@payever-microservices/core/infra/base.controller';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { GetAvatarUseCase } from './get-avatar.useCase';
import { UnexpectedError } from '@payever-microservices/core/logic/genericAppError';
import { FailRequest } from '@payever-microservices/core/exceptions/fail.exception';
import { match } from 'assert';
import { NotFound } from '@payever-microservices/core/exceptions/not-found.exception';
import { BadRequest } from '@payever-microservices/core/exceptions/bad-request.exception';
import { Conflict } from '@payever-microservices/core/exceptions/conflict.exception';

@Controller()
export class GetAvatarController extends BaseController {
  constructor(private readonly useCase: GetAvatarUseCase) {
    super();
  }

  @MessagePattern('get_user_avatar')
  async executeImpl(@Payload(ValidationPipe) userID: string): Promise<any> {
    let result = null;

    try {
      result = await this.useCase.execute(userID);
    } catch (error) {
      console.log(error);

      switch (error.status) {
        case 400:
          return this.clientError(error.message ?? '');
        case 404:
          return this.notFound(error.message ?? '');
        case 409:
          return this.conflict(error.message ?? '');
        default:
          return this.fail(error.message ?? '');
      }
    }

    if (result.isRight()) {
      return result.value.getValue();
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
