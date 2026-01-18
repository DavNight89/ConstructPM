"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = exports.databaseConfig = void 0;
const config_1 = require("@nestjs/config");
const typeorm_1 = require("typeorm");
exports.databaseConfig = (0, config_1.registerAs)('database', () => ({
    type: (process.env.DB_TYPE || 'postgres'),
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
}));
exports.AppDataSource = new typeorm_1.DataSource({
    type: (process.env.DB_TYPE || 'postgres'),
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'constructpm',
    password: process.env.DB_PASSWORD || 'constructpm123',
    database: process.env.DB_DATABASE || 'constructpm_db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    synchronize: false,
});
//# sourceMappingURL=database.config.js.map