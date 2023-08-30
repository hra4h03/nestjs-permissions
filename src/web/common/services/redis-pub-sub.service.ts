import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { Config } from 'src/web/common/config/config';

@Injectable()
export class RedisPubSubService implements OnModuleInit {
  private sub: Redis;
  private pub: Redis;
  private readonly logger = new Logger(RedisPubSubService.name);

  public getSub() {
    return this.sub;
  }

  public getPub() {
    return this.pub;
  }

  async onModuleInit() {
    this.logger.log(
      `Connecting to redis-pub-sub at ${Config.redis.host}:${Config.redis.port}`,
    );
    // this.sub = new Redis({
    //   host: Config.redis.host,
    //   port: Config.redis.port,
    //   password: Config.redis.password,
    // });
    // this.pub = new Redis({
    //   host: Config.redis.host,
    //   port: Config.redis.port,
    //   password: Config.redis.password,
    // });
  }
}
