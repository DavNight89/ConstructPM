import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS Configuration
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
    credentials: true,
  });

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('ConstructPM API')
    .setDescription('Construction Project Management Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Projects', 'Project management endpoints')
    .addTag('Dispatch', 'Worker dispatch and tracking')
    .addTag('Forms', 'Dynamic form builder and submissions')
    .addTag('Workflows', 'Workflow automation')
    .addTag('Reports', 'Report generation and exports')
    .addTag('Integrations', 'Third-party integrations')
    .addTag('Users', 'User management')
    .addTag('Notifications', 'Email, SMS, and push notifications')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`
    🚀 ConstructPM Backend is running!

    📍 API: http://localhost:${port}/api
    📖 Swagger Docs: http://localhost:${port}/api/docs
    🔐 Environment: ${process.env.NODE_ENV || 'development'}
  `);
}

bootstrap();
