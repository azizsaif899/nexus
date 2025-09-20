import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { AiCoreService, GeminiClient } from '../mocks/core-logic.mock';

@Module({
  providers: [ChatGateway, AiCoreService, GeminiClient],
})
export class ChatModule {}
