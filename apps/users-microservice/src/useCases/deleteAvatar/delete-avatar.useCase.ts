import { Inject } from '@nestjs/common';
import {
  Either,
  Result,
  right,
} from '@payever-microservices/core/logic/result';
import { UseCase } from '@payever-microservices/core/domain/use-case';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { UnexpectedError } from '@payever-microservices/core/logic/genericAppError';

type Response = Either<UnexpectedError | Result<any>, Result<void>>;

type UserID = string;

export class DeleteAvatarUseCase implements UseCase<UserID, Promise<Response>> {
  constructor(
    @Inject('FILES_MICROSERVICE') private readonly filesClient: ClientProxy,
  ) {}

  async execute(userID: UserID): Promise<Response> {
    await firstValueFrom(
      this.filesClient.send('delete_file', {
        userID,
        type: 'avatar',
      }),
    );

    return right(Result.ok<void>()) as Response;
  }
}
