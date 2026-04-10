import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import * as express from 'express';

function getAllowedOrigins(): string[] {
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
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // ── Global validation pipe ────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,               // strip unknown fields
      forbidNonWhitelisted: true,    // throw 400 on unknown fields
      transform: true,               // auto-cast primitives
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── CORS ─────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: getAllowedOrigins(),
    credentials: true,
  });

  // ── Serve static files (compiled PDFs, uploaded templates) ────────────────
  // Accessible at /uploads/compiled/<file>.pdf and /uploads/templates/<file>
  app.use(
    '/uploads',
    express.static(path.join(process.cwd(), 'public', 'uploads')),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}`);
}

bootstrap();
