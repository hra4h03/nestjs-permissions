import { DomainEvent } from 'src/common/aggregate/DomainEvent';

export class DragonKilledEvent implements DomainEvent {
  public readonly __event: 'DragonKilled.DomainEvent';

  constructor(
    public readonly heroId: number,
    public readonly dragonId: number,
  ) {}
}
