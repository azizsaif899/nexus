import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  app.enableCors();
  
  const port = configService.get<number>('port') || 3000;
  const environment = configService.get<string>('environment') || 'development';
  
  await app.listen(port);
  
  // Removed console.log
  // Removed console.log
  // Removed console.log
  // Removed console.log
}
bootstrap();
