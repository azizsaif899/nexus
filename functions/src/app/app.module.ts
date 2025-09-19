import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { appConfig } from '../config/app.config';
import { CrmModule } from '../crm/crm.module'; // إضافة جديدة

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env'],
    }),
    CrmModule, // إضافة جديدة
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
