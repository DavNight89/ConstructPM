import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { mongodbConfig } from './config/mongodb.config';
import { redisConfig } from './config/redis.config';

// Import modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { FormsModule } from './modules/forms/forms.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { ReportsModule } from './modules/reports/reports.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, mongodbConfig, redisConfig],
    }),

    // PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('database');
        if (!dbConfig) {
          throw new Error('Database configuration is missing');
        }
        return dbConfig;
      },
      inject: [ConfigService],
    }),

    // MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const mongoConfig = configService.get('mongodb');
        if (!mongoConfig) {
          throw new Error('MongoDB configuration is missing');
        }
        return mongoConfig;
      },
      inject: [ConfigService],
    }),

    // Redis / Bull Queue
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: configService.get('redis'),
      }),
      inject: [ConfigService],
    }),

    // Feature Modules
    AuthModule,
    UsersModule,
    ProjectsModule,
    DispatchModule,
    FormsModule,
    WorkflowsModule,
    ReportsModule,
    IntegrationsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
