import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private chatService: ChatService,
  ) {}

  async sendMessage(data: { content: string; chatId: string; userId: string }) {
    // Verify chat ownership
    await this.chatService.findOne(data.chatId, data.userId);

    // Save user message
    const userMessage = this.messageRepository.create({
      content: data.content,
      role: 'user',
      chatId: data.chatId,
      createdAt: new Date(),
    });

    await this.messageRepository.save(userMessage);

    // Generate AI response (simplified)
    const aiResponse = await this.generateAIResponse(data.content);

    // Save AI message
    const aiMessage = this.messageRepository.create({
      content: aiResponse,
      role: 'assistant',
      chatId: data.chatId,
      createdAt: new Date(),
    });

    await this.messageRepository.save(aiMessage);

    return {
      userMessage,
      aiMessage,
    };
  }

  async findByChatId(chatId: string, userId: string) {
    // Verify chat ownership
    await this.chatService.findOne(chatId, userId);

    return this.messageRepository.find({
      where: { chatId },
      order: { createdAt: 'ASC' },
    });
  }

  async stopGeneration(chatId: string, userId: string) {
    // Verify chat ownership
    await this.chatService.findOne(chatId, userId);

    // Implementation for stopping generation
    return { message: 'Generation stopped' };
  }

  private async generateAIResponse(content: string): Promise<string> {
    // Simplified AI response - integrate with Gemini AI here
    return `مرحباً! تلقيت رسالتك: "${content}". كيف يمكنني مساعدتك؟`;
  }
}