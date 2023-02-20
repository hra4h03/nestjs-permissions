import {
  BaseEntity,
  Embedded,
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

import { DragonAlreadyDeadException } from '../../errors/DragonAlreadyDead.exception';
import { Auditable, Writeable } from '../../primitives/base.entity';
import { Hero } from '../hero/hero.aggregate';
import { Transform } from 'class-transformer';

export enum DragonStatus {
  ALIVE,
  DEAD,
}

@Entity()
export class Dragon extends BaseEntity<Dragon, 'id'> {
  public static born(name: string) {
    const dragon: Writeable<Dragon> = new Dragon();
    dragon.status = DragonStatus.ALIVE;
    dragon.name = name;
    dragon.auditable = new Auditable();

    return dragon;
  }

  @PrimaryKey({ autoincrement: true, primary: true })
  public readonly id: number;

  @Property()
  public readonly name: string;

  @Enum({ items: () => DragonStatus, default: DragonStatus.ALIVE })
  public readonly status: DragonStatus;

  @Embedded(() => Auditable, { prefix: false })
  public readonly auditable: Auditable;

  @ManyToOne(() => Hero, {
    serializer: (hero) => hero?.toJSON(),
    eager: false,
    nullable: true,
  })
  @Transform(({ value }) => value.toArray())
  public readonly killedBy?: Hero;

  public die(this: Writeable<Dragon>) {
    if (this.status === DragonStatus.DEAD)
      throw new DragonAlreadyDeadException(this.id);
    this.status = DragonStatus.DEAD;
  }
}
