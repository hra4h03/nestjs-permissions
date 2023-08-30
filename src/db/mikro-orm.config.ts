import { LoadStrategy } from '@mikro-orm/core';
import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Config } from '../web/common/config/config';
import { OutboxSubscriber } from 'src/common/subscriber/outbox.subscriber';

const databaseConfig = defineConfig({
  host: Config.database.host,
  port: Config.database.port,
  user: Config.database.username,
  password: Config.database.password,

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  dbName: Config.database.dbName,
  entities: ['dist/**/*.aggregate.js', 'dist/**/aggregates/**/*.js'],
  entitiesTs: ['src/**/*.aggregate.ts', 'src/**/aggregates/**/*.ts'],
  debug: !Config.isProduction,
  // subscribers: ['dist/**/*.subscriber.js'],
  // subscribersTs: ['src/**/*.subscriber.ts'],
  metadataProvider: TsMorphMetadataProvider,
  loadStrategy: LoadStrategy.JOINED,
  highlighter: new SqlHighlighter(),
  migrations: {
    path: 'dist/db/migrations',
    pathTs: 'src/db/migrations',
  },
  subscribers: [new OutboxSubscriber()],
  seeder: {
    path: 'dist/db/seeds',
    pathTs: 'src/db/seeds',
  },
});

export default databaseConfig;
