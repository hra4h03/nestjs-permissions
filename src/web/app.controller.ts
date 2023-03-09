import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiController } from './base.controller';
import { KafkaService } from '@/web/common/services/kafka.service';
import { RedisPubSubClient } from '@/web/common/redis/redis-client';

@Controller('/hero-game')
// @UseGuards(JwtGuard, PoliciesGuard)
export class AppController extends ApiController {
  @RedisPubSubClient()
  public client: ClientProxy;

  constructor(private readonly kafkaService: KafkaService) {
    super();
  }

  @Get('/sum-redis')
  @ApiOkResponse({ type: Number })
  sumRedis(@Query('sum', ParseIntPipe) sum: number) {
    return this.client.send<number>(
      'sum',
      Array.from({ length: sum }, (_, i) => i + 1),
    );
  }

  @Get('/sum-kafka')
  @ApiOkResponse({ type: Number })
  sumKafka(@Query('sum', ParseIntPipe) sum: number) {
    const array = new Int32Array(sum).map((x, i) => i + 1).toString();
    return this.kafkaService.getProducer().send({
      topic: 'topic-1',
      messages: [{ value: array }],
    });
  }
}
