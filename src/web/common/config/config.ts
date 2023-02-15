import * as dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
});

export const Config = {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 3000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'P@ssw0rd',
    dbName: process.env.DB_DATABASE || 'nestjs_build',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    accessTokenExpires: process.env.ACCESS_TOKEN_EXPIRES || '15m',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
  },
} as const;
