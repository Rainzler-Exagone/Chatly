import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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

  const config = new DocumentBuilder()
    .setTitle('Chat API')
    .setDescription('Real-time chat application API documentation')
    .setVersion('1.0')
    .addBearerAuth() // if using JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/docs', app, document);

  await app.listen(3000);
}
bootstrap();
