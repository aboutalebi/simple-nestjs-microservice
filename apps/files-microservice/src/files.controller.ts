import {
  Controller,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { readFileSync } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { BadRequest } from '@payever-microservices/core/exceptions/bad-request.exception';
import { FailRequest } from '@payever-microservices/core/exceptions/fail.exception';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { UserFileDTO } from './dtos/user-file.dto';
import { NotFound } from '@payever-microservices/core/exceptions/not-found.exception';
import { UnexpectedError } from '@payever-microservices/core/logic/genericAppError';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('/:userID/:type')
  @UseInterceptors(FileInterceptor('image'))
  async uploadedFile(
    @Param('userID') userID: string,
    @Param('type') type: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string | any> {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };

    const result = await this.filesService.saveUserFileWithType(
      file.filename,
      userID,
      type,
    );

    if (result.isLeft()) {
      const error = result.value;

      const message = error.errorValue().message;

      switch (error.constructor) {
        case UnexpectedError:
          throw new FailRequest(message ? message : 'Failed Request');
        default:
          throw new BadRequest(message ? message : 'Bad Request');
      }
    }

    return response;
  }

  @MessagePattern('get_file')
  async getUserFileByType(@Payload(ValidationPipe) getFileDTO: UserFileDTO) {
    const result = await this.filesService.getOneByUserAndType(getFileDTO);

    if (result.isRight()) {
      const fileName = result.value.getValue();
      const buff = readFileSync(`./public/${fileName}`);
      return buff.toString('base64');
    } else if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UnexpectedError:
          throw new RpcException(new FailRequest(error.errorValue().message));
        case NotFoundException:
          throw new RpcException(new NotFound('File Not Found'));
        default:
          throw new RpcException(new BadRequest(error.errorValue().message));
      }
    }

    return null;
  }

  @MessagePattern('delete_file')
  async deleteUserFileByType(
    @Payload(ValidationPipe) getFileDTO: UserFileDTO,
  ): Promise<any> {
    const result = await this.filesService.deleteUserFileByType(getFileDTO);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UnexpectedError:
          throw new RpcException(new FailRequest(error.errorValue().message));
        case NotFoundException:
          throw new RpcException(new NotFound('File Not Found'));
        default:
          throw new RpcException(new BadRequest(error.errorValue().message));
      }
    }

    return null;
  }
}
