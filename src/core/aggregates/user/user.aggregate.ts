import {
  BaseEntity,
  BeforeCreate,
  BeforeUpdate,
  Embedded,
  Entity,
  EventArgs,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';

import { Auditable, Writeable } from '../../primitives/base.entity';
import { Role } from './role/role';

@Entity()
@Unique<User>({ properties: ['name'] })
export class User extends BaseEntity<User, 'id'> {
  @PrimaryKey({ primary: true, autoincrement: true })
  public readonly id: number;

  @Property()
  public readonly name: string;

  @Property()
  public readonly password: string;

  @ManyToOne()
  public readonly role: Role;

  @Embedded(() => Auditable, { prefix: false })
  public readonly auditable: Auditable;

  constructor(object: Partial<Writeable<User>> = {}) {
    super();
    Object.assign(this, object);
    if (!this.auditable) {
      this.auditable = new Auditable();
    }
  }

  @BeforeUpdate()
  public async beforeUpdate(args: EventArgs<Writeable<User>>) {
    if (args.changeSet.payload?.password) {
      args.entity.password = await bcrypt.hash(
        args.changeSet?.payload.password,
        10,
      );
    }
  }

  @BeforeCreate()
  async beforeCreate(args: EventArgs<Writeable<User>>) {
    if (args.changeSet.payload?.password) {
      args.entity.password = await bcrypt.hash(
        args.changeSet?.payload.password,
        10,
      );
    }
  }
}

// @Subscriber()
// export class UserSubscriber implements EventSubscriber<User> {
//   getSubscribedEntities(): EntityName<User>[] {
//     return [User];
//   }
//
//   async beforeUpdate(args: EventArgs<Writeable<User>>) {
//     if (args.changeSet.payload?.password) {
//       args.entity.password = await bcrypt.hash(
//         args.changeSet?.payload.password,
//         10,
//       );
//     }
//   }
//
//   async beforeCreate(args: EventArgs<Writeable<User>>) {
//     if (args.changeSet.payload?.password) {
//       args.entity.password = await bcrypt.hash(
//         args.changeSet?.payload.password,
//         10,
//       );
//     }
//   }
// }
