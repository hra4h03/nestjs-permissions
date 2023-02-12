import { AsyncLocalStorage } from 'node:async_hooks';

import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

type Store = Map<string, unknown>;

export class TracingMiddleware implements NestMiddleware {
  public static readonly X_REQUEST_ID = 'x-request-id';
  private static readonly context = new AsyncLocalStorage<Store>();

  public static getTracingContext() {
    return this.context.getStore();
  }

  use(req: Request, _res: Response, next: NextFunction) {
    const store: Store = new Map();
    this.setTraceId(store, req);

    TracingMiddleware.context.run(store, () => next());
  }

  private setTraceId(store: Map<string, unknown>, req: Request) {
    if (!req.headers[TracingMiddleware.X_REQUEST_ID]) {
      req.headers[TracingMiddleware.X_REQUEST_ID] = uuid();
    }

    store.set(
      TracingMiddleware.X_REQUEST_ID,
      req.headers[TracingMiddleware.X_REQUEST_ID],
    );
  }
}
