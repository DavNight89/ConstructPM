import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

export const databaseConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: (process.env.DB_TYPE || 'postgres') as any,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'constructpm',
    password: process.env.DB_PASSWORD || 'constructpm123',
    database: process.env.DB_DATABASE || 'constructpm_db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  }),
);

// DataSource for migrations
export const AppDataSource = new DataSource({
  type: (process.env.DB_TYPE || 'postgres') as any,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'constructpm',
  password: process.env.DB_PASSWORD || 'constructpm123',
  database: process.env.DB_DATABASE || 'constructpm_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: false,
} as DataSourceOptions);
