import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

import { AppModule } from './web/app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { Config } from '@/web/common/config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ZodValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('NestJS Realworld Example App')
    .setDescription('The Realworld API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/swagger', app, document);

  await app.listen(Config.port, () => {
    logger.log(
      'Up & running at http://localhost:3000',
      'NestApplication',
      'Application',
    );
  });
}

bootstrap();