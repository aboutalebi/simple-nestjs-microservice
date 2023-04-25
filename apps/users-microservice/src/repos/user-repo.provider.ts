import { Provider } from '@nestjs/common';
import { UserRepo } from './user.repo';

export const UserRepoProvider: Provider = {
  provide: 'UserRepo',
  useClass: UserRepo,
};
