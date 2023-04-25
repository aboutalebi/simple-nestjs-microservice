import { User } from '../../domain';
import {
  Either,
  Result,
  left,
  right,
} from '@payever-microservices/core/logic/result';
import { UseCase } from '@payever-microservices/core/domain/use-case';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { UnexpectedError } from '@payever-microservices/core/logic/genericAppError';

type Response = Either<UnexpectedError | Result<any>, Result<User>>;

@Injectable()
export class GetUserUseCase implements UseCase<number, Promise<Response>> {
  constructor(private readonly httpService: HttpService) {}

  async execute(userID: number): Promise<Response> {
    const response = await this.httpService.axiosRef.get(
      `https://reqres.in/api/users/${userID}`,
    );

    const { id, first_name, last_name, email } = response.data.data;

    const userOrError = User.create(
      {
        emailAddress: email,
        name: first_name,
        familyName: last_name,
        isEmailVerified: false,
      },
      id,
    );

    if (userOrError.isFailure) {
      return left(Result.fail<void>(userOrError.error)) as Response;
    }

    const user: User = userOrError.getValue();

    return right(Result.ok<User>(user)) as Response;
  }
}
