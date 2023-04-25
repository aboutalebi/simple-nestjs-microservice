import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import {
  Either,
  Result,
  left,
  right,
} from '@payever-microservices/core/logic/result';
import { FileDomain } from './domain';
import { IFileRepo } from './repos/file.repo';
import { UserFileDTO } from './dtos/user-file.dto';
import { unlinkSync } from 'fs';
import { UnexpectedError } from '@payever-microservices/core/logic/genericAppError';

type Response = Either<
  UnexpectedError | Result<any>,
  Result<void> | Result<string>
>;

const FileRepo = () => Inject('FileRepo');

@Injectable()
export class FilesService {
  constructor(@FileRepo() private readonly fileRepo: IFileRepo<FileDomain>) {}

  async saveUserFileWithType(
    fileName: string,
    userID: string,
    type: string,
  ): Promise<Response> {
    const fileOrError = FileDomain.create({
      userId: userID,
      name: fileName,
      type: type,
    });

    if (fileOrError.isFailure) {
      return left(Result.fail<void>(fileOrError.error)) as Response;
    }

    const file: FileDomain = fileOrError.getValue();

    try {
      await this.fileRepo.create(file);
    } catch (err) {
      return left(new UnexpectedError(err)) as Response;
    }

    return right(Result.ok<void>()) as Response;
  }

  async getOneByUserAndType(getFileDTO: UserFileDTO): Promise<string | any> {
    const fileInfo = await this.fileRepo.findByUserAndType(
      getFileDTO.userID,
      getFileDTO.type,
    );

    if (fileInfo) {
      return right(Result.ok<string>(fileInfo.name)) as Response;
    } else {
      return left(new NotFoundException()) as Response;
    }
  }

  async deleteUserFileByType(deleteFileDTO: UserFileDTO): Promise<void | any> {
    const fileInfo = await this.fileRepo.findByUserAndType(
      deleteFileDTO.userID,
      deleteFileDTO.type,
    );

    if (fileInfo) {
      unlinkSync(`./public/${fileInfo.name}`);
      await this.fileRepo.findByIdAndRemove(fileInfo.id.toString());

      return right(Result.ok<void>()) as Response;
    } else {
      return left(new NotFoundException()) as Response;
    }
  }
}
