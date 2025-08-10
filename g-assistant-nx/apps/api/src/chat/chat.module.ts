import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { AiCoreService, GeminiClient } from '@g-assistant-nx/core-logic';

@Module({
  providers: [ChatGateway, AiCoreService, GeminiClient],
})
export class ChatModule {}