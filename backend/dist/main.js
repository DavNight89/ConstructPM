"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
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
//# sourceMappingURL=main.js.map