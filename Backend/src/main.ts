import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validates all incoming request bodies against their DTOs.
  // - whitelist: strips unknown fields automatically
  // - forbidNonWhitelisted: throws 400 if unknown fields are sent
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // auto-transforms primitives (e.g. string → number)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
