import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class CustomResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        status: true,
        message: 'Request successful',
        data,
        errors: null,
      })),
      catchError((error) => {
        if (error instanceof BadRequestException) {
          const response = error.getResponse();
          const errorMessage =
            typeof response === 'string' ? response : (response as any).message;
          const errors =
            typeof response === 'object' && (response as any).errors
              ? (response as any).errors
              : { error: [errorMessage] };
          return throwError(
            () =>
              new BadRequestException({
                status: false,
                message: errorMessage || 'An error occurred',
                data: null,
                errors,
              }),
          );
        }
        return throwError(() => error); // Propagate other errors
      }),
    );
  }
}
