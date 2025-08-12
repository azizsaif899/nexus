import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { corsConfig } from './cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors(corsConfig);
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 API Server running on http://localhost:${port}`);
}

bootstrap();