import {
  BaseEntity,
  Check,
  Collection,
  Embedded,
  Entity,
  Filter,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';

import { Auditable, Writeable } from '../../primitives/base.entity';
import { Dragon } from '../dragon/dragon.aggregate';

@Filter<Hero>({
  name: 'dragonKillers',
  args: true,
  cond: (args) => ({
    killedDragonsCount: {
      $gt: args.$gt || 0,
    },
  }),
})
@Unique<Hero>({ properties: ['name'] })
@Check<Hero>({ expression: (columns) => `${columns.skill} >= 0` })
@Entity()
export class Hero extends BaseEntity<Hero, 'id'> {
  @PrimaryKey({ autoincrement: true, primary: true })
  public readonly id: number;

  @Property()
  public readonly name: string;

  @Property()
  public readonly skill: number;

  @Embedded(() => Auditable, { prefix: false })
  public readonly auditable: Auditable;

  @OneToMany(() => Dragon, (dragon) => dragon.killedBy, {
    serializer: (dragon) => dragon.toArray(),
  })
  public readonly killedDragons = new Collection<Dragon>(this);

  @Property()
  public readonly killedDragonsCount: number = this.killedDragons.count();

  public async killDragon(this: Writeable<Hero>, dragon: Dragon) {
    dragon.die();
    this.killedDragons.add(dragon);
    this.killedDragonsCount = await this.killedDragons.loadCount();
    this.increaseSkill();
  }

  public increaseSkill(this: Writeable<Hero>): Hero {
    this.skill += 5;
    return this;
  }
}
