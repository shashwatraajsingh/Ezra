"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path = require("path");
const express = require("express");
function getAllowedOrigins() {
    const configured = process.env.FRONTEND_URL
        ?.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
    if (configured?.length) {
        return configured;
    }
    return ['http://localhost:3000', 'http://localhost:3001'];
}
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.enableCors({
        origin: getAllowedOrigins(),
        credentials: true,
    });
    app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    logger.log(`Server running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map