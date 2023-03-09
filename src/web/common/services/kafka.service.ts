import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private producer: Producer;

  public getProducer() {
    return this.producer;
  }

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'my-app',
      brokers: ['localhost:9093'],
    });

    this.producer = kafka.producer();
    await this.producer.connect();
  }
}
