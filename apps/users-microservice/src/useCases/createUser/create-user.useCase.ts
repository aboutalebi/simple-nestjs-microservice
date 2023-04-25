import { CreateUserDTO } from './create-user.dto';
import { UserEmail, UserPassword, User } from '../../domain';
import { IUserRepo } from '../../repos/user.repo';
import { Inject } from '@nestjs/common';
import {
  Either,
  Result,
  left,
  right,
} from '@payever-microservices/core/logic/result';
import { UseCase } from '@payever-microservices/core/domain/use-case';
import { UserCreatedEvent } from '../../events/user-created.event';
import { UnexpectedError } from '@payever-microservices/core/logic/genericAppError';
import { AccountAlreadyExists } from './errors';

type Response = Either<
  UnexpectedError | AccountAlreadyExists | Result<any>,
  Result<void>
>;

const UserRepo = () => Inject('UserRepo');

export class CreateUserUseCase
  implements UseCase<CreateUserDTO, Promise<Response>>
{
  constructor(
    @UserRepo() private readonly userRepo: IUserRepo<User>,
    private readonly userCreatedEvent: UserCreatedEvent,
  ) {}

  async execute(req: CreateUserDTO): Promise<Response> {
    const { name, familyName } = req;

    const emailOrError = UserEmail.create(req.emailAddress);
    const passwordOrError = UserPassword.create({ value: req.password });

    const combinedPropsResult = Result.combine([emailOrError, passwordOrError]);

    if (combinedPropsResult.isFailure) {
      return left(Result.fail<void>(combinedPropsResult.error)) as Response;
    }

    const userOrError = User.create({
      emailAddress: emailOrError.getValue(),
      password: passwordOrError.getValue(),
      name,
      familyName,
      isEmailVerified: false,
    });

    if (userOrError.isFailure) {
      return left(Result.fail<void>(combinedPropsResult.error)) as Response;
    }

    const user: User = userOrError.getValue();

    const userAlreadyExists = await this.userRepo.exists(user.emailAddress);

    if (userAlreadyExists) {
      return left(
        new AccountAlreadyExists(user.emailAddress.value),
      ) as Response;
    }

    try {
      await this.userRepo.create(user);
    } catch (err) {
      return left(new UnexpectedError(err)) as Response;
    }

    this.userCreatedEvent.emit(user);

    return right(Result.ok<void>()) as Response;
  }
}
