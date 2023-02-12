import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable, tap } from 'rxjs';

import { TracingMiddleware } from '../middlewares/trace.middleware';

export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      return this.logHttpCall(context, next);
    }

    return next.handle();
  }

  private readonly logger = new Logger(LoggingInterceptor.name);

  private logHttpCall(context: ExecutionContext, next: CallHandler) {
    const request: Request = context.switchToHttp().getRequest();
    const userAgent = request.get('user-agent') || '';
    const { ip, method, path: url } = request;

    const store = TracingMiddleware.getTracingContext();
    const traceId = store && store.get(TracingMiddleware.X_REQUEST_ID);
    const now = Date.now();

    this.logger.verbose({
      userAgent,
      traceId,
      method,
      url,
      ip,
    });

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const contentLength = response.get('content-length');
        const durationMs = Date.now() - now;

        this.logger.verbose({
          statusCode: response.statusCode,
          contentLength,
          durationMs,
          traceId,
        });
      }),
    );
  }
}
