import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';

type CreateInput = Pick<
  OutboxMessage,
  'type' | 'content' | 'occuredOn' | 'processedOn'
>;

@Entity()
export class OutboxMessage extends BaseEntity<OutboxMessage, 'id'> {
  @PrimaryKey({ autoincrement: true, primary: true })
  public readonly id: number;

  @Property()
  public readonly type: string;

  @Property()
  public readonly content?: string;

  @Property()
  public readonly occuredOn: Date = new Date();

  @Property({ nullable: true })
  public readonly processedOn?: Date = new Date();

  public static create(input: CreateInput) {
    const outbox = new OutboxMessage();
    outbox.assign(input);
    return outbox;
  }
}
