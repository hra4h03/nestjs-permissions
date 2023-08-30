import {
  BaseEntity,
  Embedded,
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

import { DragonAlreadyDeadError } from '../../errors/DragonAlreadyDead.error';
import { Auditable, Writeable } from '../../primitives/base.entity';
import { Hero } from '../hero/hero.aggregate';
import { Transform } from 'class-transformer';
import { Result } from '@/common/primitives/Result';

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

  public die(this: Writeable<Dragon>): Result<true, DragonAlreadyDeadError> {
    if (this.status === DragonStatus.DEAD) {
      return Result.fail(new DragonAlreadyDeadError(this.id));
    }

    this.status = DragonStatus.DEAD;
    return Result.ok(true);
  }
}
