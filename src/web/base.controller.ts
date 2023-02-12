import { HttpException } from '@nestjs/common';
import { of } from 'rxjs';

import { TracingMiddleware } from './common/middlewares/trace.middleware';

export class ApiController {
  protected wrapError(error: HttpException) {
    const traceId = TracingMiddleware.getTracingContext()?.get(
      TracingMiddleware.X_REQUEST_ID,
    );

    return of({
      traceId: traceId,
      message: error.message,
      statusCode: error.getStatus(),
      stack: error.stack,
    });
  }
}
