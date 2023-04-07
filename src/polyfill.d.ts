declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'production' | 'development';
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_DATABASE: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_PASSWORD: string;
    KAFKA_HOST: string;
    KAFKA_PORT: number;
    PORT: number;
    JWT_SECRET: string;
    ACCESS_TOKEN_EXPIRES: string;
  }
}
