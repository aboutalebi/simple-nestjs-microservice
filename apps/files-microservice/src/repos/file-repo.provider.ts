import { Provider } from '@nestjs/common';
import { FileRepo } from './file.repo';

export const FileRepoProvider: Provider = {
  provide: 'FileRepo',
  useClass: FileRepo,
};
