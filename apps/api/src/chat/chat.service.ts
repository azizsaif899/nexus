import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async create(createChatData: { title?: string; userId: string }) {
    const chat = this.chatRepository.create({
      title: createChatData.title || 'محادثة جديدة',
      userId: createChatData.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.chatRepository.save(chat);
  }

  async findByUserId(userId: string) {
    return this.chatRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    const chat = await this.chatRepository.findOne({
      where: { id, userId },
      relations: ['messages'],
    });

    if (!chat) {
      throw new NotFoundException('Chat session not found');
    }

    return chat;
  }

  async updateTitle(id: string, title: string, userId: string) {
    const chat = await this.findOne(id, userId);
    
    chat.title = title;
    chat.updatedAt = new Date();
    
    return this.chatRepository.save(chat);
  }

  async delete(id: string, userId: string) {
    const chat = await this.findOne(id, userId);
    
    await this.chatRepository.remove(chat);
    
    return { message: 'Chat deleted successfully' };
  }
}