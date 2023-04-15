import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { Config } from '@/web/common/config/config';

@Injectable()
export class RedisSortedSetService implements OnModuleInit {
  private redis: Redis;
  private readonly logger = new Logger(RedisSortedSetService.name);

  public get() {
    return this.redis;
  }

  async onModuleInit() {
    this.logger.log(
      `Connecting to redis-sorted-set at ${Config.redis.host}:${Config.redis.port}`,
    );

    this.redis = new Redis({
      host: Config.redis.host,
      port: Config.redis.port,
      password: Config.redis.password,
    });
  }
}
