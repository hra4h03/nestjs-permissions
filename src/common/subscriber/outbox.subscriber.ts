import { AggregateRoot } from 'src/common/aggregate/AggregateRoot';
import { OutboxMessage } from 'src/core/aggregates/outbox/outboxMessage.aggregate';
import { EventSubscriber, FlushEventArgs, ChangeSet } from '@mikro-orm/core';

function isAggregateRoot(entity: any): entity is AggregateRoot {
  return entity instanceof AggregateRoot;
}

export class OutboxSubscriber implements EventSubscriber {
  async onFlush(args: FlushEventArgs): Promise<void> {
    const changeSets = args.uow.getChangeSets();

    changeSets
      .filter((cs) => isAggregateRoot(cs.entity))
      .flatMap((cs: ChangeSet<Partial<AggregateRoot>>) => {
        const events = cs.entity.getDomainEvents();
        cs.entity.clearDomainEvents();

        events.map((event) => {
          const outbox = OutboxMessage.create({
            occuredOn: new Date(),
            processedOn: null,
            content: JSON.stringify(event),
            type: Reflect.getPrototypeOf(event).constructor.name,
          });
          args.uow.computeChangeSet(outbox);
        });
      });
  }
}
