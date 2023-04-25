import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { FileDomain } from '../domain';
import { IFileEntity } from './file.entity';
import { FileMap } from '../mappers/file.map';

export interface IFileRepo<T> {
  findById(id: string): Promise<T>;
  create(user: T): Promise<T>;
  findByUserAndType(userID: string, type: string): Promise<T>;
  findByIdAndRemove(id: string): Promise<void>;
}

@Injectable()
export class FileRepo implements IFileRepo<FileDomain> {
  constructor(
    @InjectModel('File') private readonly fileModel: Model<IFileEntity>,
  ) {}

  public async findById(id: string): Promise<FileDomain> {
    const fileData = await this.fileModel.findById(id);

    if (!!fileData === true) {
      const fileOrError = FileDomain.create({
        userId: fileData.userId,
        name: fileData.name,
        type: fileData.type,
      });

      if (fileOrError.isFailure) {
        return null;
      }

      return fileOrError.getValue();
    } else {
      return null;
    }
  }

  public async create(file: FileDomain): Promise<FileDomain> {
    const rawFile = FileMap.toPersistence(file);

    try {
      await this.fileModel.create(rawFile);
      return file;
    } catch (err) {
      console.log(err);
    }
  }

  public async findByUserAndType(
    userID: string,
    type: string,
  ): Promise<FileDomain> {
    const fileData = await this.fileModel.findOne({ userId: userID, type });

    if (!!fileData === true) {
      const fileOrError = FileDomain.create(
        {
          userId: fileData.userId,
          name: fileData.name,
          type: fileData.type,
        },
        fileData.id,
      );

      if (fileOrError.isFailure) {
        return null;
      }

      return fileOrError.getValue();
    } else {
      return null;
    }
  }

  public async findByIdAndRemove(fileID: string): Promise<void> {
    return await this.fileModel.findByIdAndRemove(fileID);
  }
}
