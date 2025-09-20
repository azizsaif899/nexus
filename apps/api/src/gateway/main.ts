import express from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

async function bootstrap() {
  const port = process.env.PORT || 3001;
  
  // Create Express app
  const app = express();
  
  // Create NestJS app
  const nestApp = await NestFactory.create(AppModule);
  
  // Enable CORS
  nestApp.enableCors();
  
  await nestApp.listen(port);
  // Removed console.log
}

bootstrap();