import { AggregateRoot } from '@/common/aggregate/AggregateRoot';
import { Result } from '@/common/primitives/Result';
import { DragonAlreadyDeadError } from '@/core/errors/DragonAlreadyDead.error';
import { DragonKilledEvent } from '@/core/events/dragonKilled.event';
import {
  Check,
  Collection,
  Embedded,
  Entity,
  Filter,
  OneToMany,
  Property,
  Unique,
  UnitOfWork,
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
export class Hero extends AggregateRoot {
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

  public async killDragon(
    this: Writeable<Hero>,
    dragon: Dragon,
  ): Promise<Result<any, DragonAlreadyDeadError>> {
    const dieResult = dragon.die();
    if (dieResult.isFailure) {
      return dieResult;
    }

    this.killedDragons.add(dragon);
    this.skill += 5;

    this.raiseDomainEvent(new DragonKilledEvent(this.id, dragon.id));
    return Result.ok();
  }
}
