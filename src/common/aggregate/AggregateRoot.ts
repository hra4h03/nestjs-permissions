import { BaseEntity, OnInit, PrimaryKey } from '@mikro-orm/core';
import { DomainEvent } from 'src/common/aggregate/DomainEvent';

export abstract class AggregateRoot extends BaseEntity<AggregateRoot, 'id'> {
  @PrimaryKey({ autoincrement: true, primary: true })
  public readonly id: number;

  private domainEvents = [];

  public getDomainEvents(): ReadonlyArray<DomainEvent> {
    return this.domainEvents;
  }

  public clearDomainEvents() {
    this.domainEvents.slice(0, this.domainEvents.length);
  }

  public raiseDomainEvent(domainEvent: DomainEvent) {
    this.domainEvents.push(domainEvent);
  }

  @OnInit()
  private initDomainEvents() {
    this.domainEvents = [];
  }
}
