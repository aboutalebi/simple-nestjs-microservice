import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileRepoProvider } from './file-repo.provider';
import { FileSchema } from './file.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'File', schema: FileSchema }])],
  providers: [FileRepoProvider],
  exports: [FileRepoProvider],
})
export class FileRepositoryModule {}
