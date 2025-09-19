import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app/app.controller';
import { appConfig } from './config/app.config';
import { CrmModule } from './crm/crm.module';
import { FigmaIntegrationService } from './services/figma-integration.service';
import { FigmaController } from './controllers/figma.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env'],
    }),
    CrmModule,
  ],
  controllers: [AppController, FigmaController],
  providers: [FigmaIntegrationService],
})
export class AppModule {}
