import { UniqueEntityID } from '@payever-microservices/core/domain/unique-entity-id';
import { User, UserEmail, UserPassword } from '../domain';
import { Mapper } from '@payever-microservices/core/infra/mapper';

export class UserMap extends Mapper<User> {
  public static toPersistence(user: User): any {
    return {
      base_user_id: user.id.toString(),
      emailAddress: user.emailAddress.value,
      password: user.password.value,
      name: user.name,
      familyName: user.familyName,
      is_email_verified: user.isEmailVerified,
    };
  }

  public static toDomain(raw: any): User {
    const userEmailOrError = UserEmail.create(raw.user_email);
    const userPasswordOrError = UserPassword.create(raw.user_password);

    const userOrError = User.create(
      {
        emailAddress: userEmailOrError.getValue(),
        password: userPasswordOrError.getValue(),
        name: raw.name,
        familyName: raw.familyName,
        isEmailVerified: raw.is_email_verified,
      },
      new UniqueEntityID(raw.base_user_id),
    );

    userOrError.isFailure ? console.log(userOrError.error) : '';

    return userOrError.isSuccess ? userOrError.getValue() : null;
  }
}
