import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // This enables DTO validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove properties that don't exist in the DTO
      forbidNonWhitelisted: true, // throw error for extra properties
      transform: true, // auto-transform payloads to DTO instances
    }),
  );

  await app.listen(3000);
}
bootstrap();
