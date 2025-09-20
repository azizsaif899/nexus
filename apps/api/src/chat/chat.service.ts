import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatSession, Message } from './entities';
import { CreateChatSessionDto, SendMessageDto } from './dto';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatSession)
    private chatSessionRepository: Repository<ChatSession>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private geminiService: GeminiService,
  ) {}

  /**
   * إنشاء جلسة محادثة جديدة
   */
  async createSession(userId: string, createSessionDto: CreateChatSessionDto) {
    const session = this.chatSessionRepository.create({
      title: createSessionDto.title || 'محادثة جديدة',
      userId,
      isActive: true,
    });

    const savedSession = await this.chatSessionRepository.save(session);
    
    return {
      id: savedSession.id,
      title: savedSession.title,
      createdAt: savedSession.createdAt,
      updatedAt: savedSession.updatedAt,
    };
  }

  /**
   * الحصول على جلسات المستخدم
   */
  async getUserSessions(userId: string) {
    const sessions = await this.chatSessionRepository.find({
      where: { userId, isActive: true },
      order: { updatedAt: 'DESC' },
      select: ['id', 'title', 'createdAt', 'updatedAt'],
    });

    return sessions;
  }

  /**
   * الحصول على تاريخ المحادثة
   */
  async getChatHistory(sessionId: string, userId: string) {
    // التحقق من ملكية الجلسة
    const session = await this.chatSessionRepository.findOne({
      where: { id: sessionId, userId, isActive: true },
    });

    if (!session) {
      throw new NotFoundException('الجلسة غير موجودة');
    }

    const messages = await this.messageRepository.find({
      where: { sessionId },
      order: { createdAt: 'ASC' },
      select: ['id', 'content', 'role', 'createdAt', 'metadata'],
    });

    return messages;
  }

  /**
   * إرسال رسالة
   */
  async sendMessage(userId: string, sendMessageDto: SendMessageDto) {
    const { content, sessionId } = sendMessageDto;

    // التحقق من ملكية الجلسة
    const session = await this.chatSessionRepository.findOne({
      where: { id: sessionId, userId, isActive: true },
    });

    if (!session) {
      throw new NotFoundException('الجلسة غير موجودة');
    }

    // حفظ رسالة المستخدم
    const userMessage = this.messageRepository.create({
      content,
      role: 'user',
      sessionId,
      status: 'sent',
    });

    const savedUserMessage = await this.messageRepository.save(userMessage);

    // الحصول على رد من Gemini AI
    try {
      const aiResponse = await this.geminiService.generateResponse(content, sessionId);
      
      // حفظ رد المساعد
      const assistantMessage = this.messageRepository.create({
        content: aiResponse.content,
        role: 'assistant',
        sessionId,
        status: 'sent',
        metadata: {
          model: aiResponse.model,
          tokens: aiResponse.tokens,
          processingTime: aiResponse.processingTime,
        },
      });

      const savedAssistantMessage = await this.messageRepository.save(assistantMessage);

      // تحديث وقت آخر نشاط للجلسة
      await this.chatSessionRepository.update(sessionId, {
        updatedAt: new Date(),
      });

      return {
        id: savedAssistantMessage.id,
        content: savedAssistantMessage.content,
        role: savedAssistantMessage.role,
        model: aiResponse.model,
        tokens: aiResponse.tokens,
        processingTime: aiResponse.processingTime,
        sessionId,
      };
    } catch (error) {
      // في حالة فشل AI، تحديث حالة رسالة المستخدم
      await this.messageRepository.update(savedUserMessage.id, {
        status: 'error',
      });
      
      throw error;
    }
  }

  /**
   * حذف جلسة محادثة
   */
  async deleteSession(sessionId: string, userId: string) {
    const session = await this.chatSessionRepository.findOne({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new NotFoundException('الجلسة غير موجودة');
    }

    // حذف ناعم - تعيين isActive إلى false
    await this.chatSessionRepository.update(sessionId, {
      isActive: false,
    });

    return { success: true };
  }

  /**
   * إيقاف توليد الرسالة
   */
  async stopGeneration(sessionId: string, userId: string) {
    // التحقق من ملكية الجلسة
    const session = await this.chatSessionRepository.findOne({
      where: { id: sessionId, userId, isActive: true },
    });

    if (!session) {
      throw new NotFoundException('الجلسة غير موجودة');
    }

    // إيقاف التوليد في Gemini Service
    await this.geminiService.stopGeneration(sessionId);

    return { success: true };
  }

  /**
   * تحديث عنوان الجلسة
   */
  async updateSessionTitle(sessionId: string, title: string, userId: string) {
    const session = await this.chatSessionRepository.findOne({
      where: { id: sessionId, userId, isActive: true },
    });

    if (!session) {
      throw new NotFoundException('الجلسة غير موجودة');
    }

    await this.chatSessionRepository.update(sessionId, {
      title,
      updatedAt: new Date(),
    });

    return {
      id: sessionId,
      title,
      updatedAt: new Date(),
    };
  }
}