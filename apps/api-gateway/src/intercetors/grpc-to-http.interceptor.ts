import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class GrpcToHttpInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        if (!(typeof err === 'object' && 'response' in err)) {
          return throwError(() => err);
        }

        const statusCode = err.status || HttpStatus.INTERNAL_SERVER_ERROR;

        return throwError(() => new HttpException(err.message, statusCode));
      }),
    );
  }
}
