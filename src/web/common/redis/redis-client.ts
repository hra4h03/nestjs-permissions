import { Client, Transport } from '@nestjs/microservices';
import { Config } from '../config/config';

export function RedisPubSubClient() {
  return Client({
    transport: Transport.REDIS,
    options: {
      host: Config.redis.host,
      port: Config.redis.port,
      password: Config.redis.password,
    },
  });
}

export function RedisSortedSetClient() {
  return Client({
    transport: Transport.REDIS,
    options: {
      host: Config.redis.host,
      port: Config.redis.port,
      password: Config.redis.password,
    },
  });
}
