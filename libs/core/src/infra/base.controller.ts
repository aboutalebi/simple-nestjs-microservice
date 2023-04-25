import { NotFound } from '../exceptions/not-found.exception';
import { Conflict } from '../exceptions/conflict.exception';
import { BadRequest } from '../exceptions/bad-request.exception';
import { RpcException } from '@nestjs/microservices';
import { FailRequest } from '../exceptions/fail.exception';

export abstract class BaseController {
  public clientError(message?: string) {
    throw new RpcException(new BadRequest(message ? message : 'Bad Request'));
  }

  public notFound(message?: string) {
    throw new RpcException(new NotFound(message ? message : 'Not found'));
  }

  public conflict(message?: string) {
    throw new RpcException(new Conflict(message ? message : 'Conflict'));
  }

  public fail(error: Error | string) {
    throw new RpcException(new FailRequest(error.toString()));
  }
}
