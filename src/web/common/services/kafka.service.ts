import { Config } from '@/web/common/config/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  public getProducer() {
    return this.producer;
  }

  public async getConsumer(groupId: string) {
    this.consumer = this.kafka.consumer({ groupId });
    await this.consumer.connect();
    return this.consumer;
  }

  async onModuleInit() {
    const broker = `${Config.kafka.host}:${Config.kafka.port}`;
    const kafka = new Kafka({
      clientId: 'my-app',
      brokers: [broker],
    });

    this.producer = kafka.producer();
    await this.producer.connect();
  }
}
