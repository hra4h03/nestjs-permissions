import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { Config } from '@/web/common/config/config';

@Injectable()
export class RedisPubSubService implements OnModuleInit {
  private sub: Redis;
  private pub: Redis;

  public getSub() {
    return this.sub;
  }

  public getPub() {
    return this.pub;
  }

  async onModuleInit() {
    this.sub = new Redis({
      host: Config.redis.host,
      port: Config.redis.port,
      password: Config.redis.password,
    });
    this.pub = new Redis({
      host: Config.redis.host,
      port: Config.redis.port,
      password: Config.redis.password,
    });
    // await this.pub.connect();
    // await this.sub.connect();
  }
}
