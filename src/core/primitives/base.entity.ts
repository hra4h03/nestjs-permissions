import { Embeddable, Property } from '@mikro-orm/core';

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

@Embeddable()
export class Auditable {
  @Property({ onCreate: () => new Date() })
  protected readonly createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  protected readonly updatedAt: Date = new Date();

  constructor(obj: Writeable<Auditable> = {}) {
    Object.assign(this, obj);
  }
}
