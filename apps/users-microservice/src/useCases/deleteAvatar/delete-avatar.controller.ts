import { Controller, ValidationPipe } from '@nestjs/common';
import { BaseController } from '@payever-microservices/core/infra/base.controller';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DeleteAvatarUseCase } from './delete-avatar.useCase';
import { UnexpectedError } from '@payever-microservices/core/logic/genericAppError';

@Controller()
export class DeleteAvatarController extends BaseController {
  constructor(private readonly useCase: DeleteAvatarUseCase) {
    super();
  }

  @MessagePattern('delete_user_avatar')
  async executeImpl(@Payload(ValidationPipe) userID: string): Promise<void> {
    const result = await this.useCase.execute(userID);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UnexpectedError:
          return this.fail(error.errorValue().message);
        default:
          return this.clientError(error.errorValue().message);
      }
    }

    return null;
  }
}
