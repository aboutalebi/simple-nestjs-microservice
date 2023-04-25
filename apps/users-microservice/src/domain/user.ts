import { UserId } from './user-id';
import { UserEmail } from './user-email';
import { UserPassword } from './user-password';
import { AggregateRoot } from '@payever-microservices/core/domain/aggregate-root';
import { UniqueEntityID } from '@payever-microservices/core/domain/unique-entity-id';
import { Result } from '@payever-microservices/core/logic/result';
import { Guard } from '@payever-microservices/core/logic/guard';

interface UserProps {
  name: string;
  familyName: string;
  emailAddress: UserEmail;
  password?: UserPassword;
  isEmailVerified: boolean;
  profilePicture?: string;
}

export class User extends AggregateRoot<UserProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get userId(): UserId {
    return UserId.caller(this.id);
  }

  get emailAddress(): UserEmail {
    return this.props.emailAddress;
  }

  get name(): string {
    return this.props.name;
  }

  get familyName(): string {
    return this.props.familyName;
  }

  get password(): UserPassword {
    return this.props.password;
  }

  get isEmailVerified(): boolean {
    return this.props.isEmailVerified;
  }

  get profilePicture(): string {
    return this.props.profilePicture;
  }

  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
    const guardedProps = [
      { argument: props.name, argumentName: 'name' },
      { argument: props.familyName, argumentName: 'familyName' },
      { argument: props.emailAddress, argumentName: 'emailAddress' },
      { argument: props.isEmailVerified, argumentName: 'isEmailVerified' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<User>(guardResult.message);
    } else {
      const user = new User(
        {
          ...props,
        },
        id,
      );

      return Result.ok<User>(user);
    }
  }
}
