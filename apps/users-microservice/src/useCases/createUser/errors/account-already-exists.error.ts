import { Result } from '@payever-microservices/core/logic/result';
import { UseCaseError } from '@payever-microservices/core/logic/use-case.error';

export class AccountAlreadyExists extends Result<UseCaseError> {
  constructor(email: string) {
    super(false, {
      message: `The email ${email} associated for this account already exists`,
    } as UseCaseError);
  }
}
