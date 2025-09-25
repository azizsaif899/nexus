import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { AiCoreService, GeminiClient } from '../mocks/core-logic.mock';

@Module({
  controllers: [ChatController],
  providers: [ChatGateway, AiCoreService, GeminiClient],
})
export class ChatModule {}
