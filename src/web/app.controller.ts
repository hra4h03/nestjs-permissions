import {
  Controller,
  Get,
  OnModuleInit,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiController } from './base.controller';
import { PoliciesGuard } from './common/guards/PoliciesGuard';
import { Config } from '@/web/common/config/config';
import { JwtGuard } from '@/auth/guards/JwtGuard';

@Controller('/hero-game')
@UseGuards(JwtGuard, PoliciesGuard)
export class AppController extends ApiController {
  @Client({
    transport: Transport.REDIS,
    options: {
      host: Config.redis.host,
      port: Config.redis.port,
      password: Config.redis.password,
    },
  })
  public client: ClientProxy;

  @Get('/sum')
  @ApiOkResponse({ type: Number })
  sum(@Query('sum', ParseIntPipe) sum: number) {
    return this.client.send<number>(
      'sum',
      Array.from({ length: sum }, (_, i) => i + 1),
    );
  }
}
