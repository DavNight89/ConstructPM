import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
export declare const databaseConfig: (() => TypeOrmModuleOptions) & import("@nestjs/config").ConfigFactoryKeyHost<TypeOrmModuleOptions>;
export declare const AppDataSource: DataSource;
