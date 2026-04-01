import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  // This enables DTO validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove properties that don't exist in the DTO
      forbidNonWhitelisted: true, // throw error for extra properties
      transform: true, // auto-transform payloads to DTO instances
    }),
  );

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    secure: process.env.NODE_ENV === 'production',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
