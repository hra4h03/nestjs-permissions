import { ApiController } from 'src/web/base.controller';
import { Controller, Get, Header } from '@nestjs/common';
import { register } from 'prom-client';

@Controller('metrics')
export class MetricsController extends ApiController {
  constructor() {
    super();
  }

  @Get()
  @Header('Content-Type', register.contentType)
  getMetrics() {
    return register.metrics();
  }
}
