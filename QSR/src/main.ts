import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 1. Validation Setup
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  // 2. Swagger Setup (Documentation)
  const config = new DocumentBuilder()
    .setTitle('QSR Order System')
    .setDescription('Waiter Management & Order API')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // URL: http://localhost:3000/api

  await app.listen(3000);
}
bootstrap();