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
import { Collection } from '@mikro-orm/core';

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
    Object.keys(data).forEach((key) => {
      const item = data[key];
      if (this.isCollection(item)) {
        data[key] = item.toArray();
      } else if (item instanceof Object && !Array.isArray(item)) {
        data[key] = this.serializeCollections(item);
      }
    });
    return data;
  }

  private isCollection(data: any): data is Collection<any> {
    return data instanceof Collection;
  }
}
