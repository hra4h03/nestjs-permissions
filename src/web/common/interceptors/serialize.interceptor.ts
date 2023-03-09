import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Type,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { BaseEntity, serialize } from '@mikro-orm/core';

export function Serialize(dto: Type) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: Type) {}

  public intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, this.serializeCollections(data), {
          excludeExtraneousValues: true,
        });
      }),
    );
  }

  private serializeCollections(data: any) {
    if (data instanceof BaseEntity) {
      return serialize(data);
    }
    if (Array.isArray(data) && data[0] instanceof BaseEntity) {
      return serialize(data);
    }

    if (data instanceof Object) {
      Object.keys(data).forEach((key) => {
        data[key] = this.serializeCollections(data[key]);
      });
    }

    return data;
  }
}
