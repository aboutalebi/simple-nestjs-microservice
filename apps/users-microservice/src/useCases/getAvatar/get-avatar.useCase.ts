import {
  Either,
  Result,
  right,
} from '@payever-microservices/core/logic/result';
import { UseCase } from '@payever-microservices/core/domain/use-case';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UnexpectedError } from '@payever-microservices/core/logic/genericAppError';

type Response = Either<UnexpectedError | Result<any>, Result<string>>;

@Injectable()
export class GetAvatarUseCase implements UseCase<string, Promise<Response>> {
  constructor(
    @Inject('FILES_MICROSERVICE') private readonly filesClient: ClientProxy,
  ) {}

  async execute(userID: string): Promise<Response> {
    const fileBase64Data = await firstValueFrom(
      this.filesClient.send('get_file', {
        userID,
        type: 'avatar',
      }),
    );

    return right(Result.ok<string>(fileBase64Data)) as Response;
  }
}
