import {
  BaseEntity,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';

import { Permission } from '../permission/permission';
import { Writeable } from 'src/core/primitives/base.entity';

@Entity()
@Unique<Role>({ properties: ['name'] })
export class Role extends BaseEntity<Role, 'id'> {
  @PrimaryKey({ primary: true, autoincrement: true })
  public readonly id: number;

  @Property()
  public readonly name: string;

  @ManyToMany()
  public readonly permissions = new Collection<Permission>(this);

  constructor(object: Partial<Writeable<Role>> = {}) {
    super();
    Object.assign(this, object);
  }
}
