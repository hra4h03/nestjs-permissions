import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { Config } from '@/web/common/config/config';

@Injectable()
export class RedisSortedSetService implements OnModuleInit {
  private redis: Redis;

  public get() {
    return this.redis;
  }

  async onModuleInit() {
    this.redis = new Redis({
      host: Config.redis.host,
      port: Config.redis.port,
      password: Config.redis.password,
    });
  }
}
