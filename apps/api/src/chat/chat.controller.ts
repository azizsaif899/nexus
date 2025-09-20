import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { CreateChatSessionDto, SendMessageDto } from './dto';

@Controller('api/chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * إنشاء جلسة محادثة جديدة
   */
  @Post('session')
  async createSession(
    @Body() createSessionDto: CreateChatSessionDto,
    @Request() req: any,
  ) {
    try {
      const userId = req.user.sub;
      return await this.chatService.createSession(userId, createSessionDto);
    } catch (error) {
      throw new HttpException(
        'فشل في إنشاء جلسة المحادثة',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * الحصول على جميع جلسات المحادثة للمستخدم
   */
  @Get('sessions')
  async getSessions(@Request() req: any) {
    try {
      const userId = req.user.sub;
      return await this.chatService.getUserSessions(userId);
    } catch (error) {
      throw new HttpException(
        'فشل في جلب جلسات المحادثة',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * الحصول على تاريخ محادثة معينة
   */
  @Get('history/:sessionId')
  async getChatHistory(
    @Param('sessionId') sessionId: string,
    @Request() req: any,
  ) {
    try {
      const userId = req.user.sub;
      return await this.chatService.getChatHistory(sessionId, userId);
    } catch (error) {
      throw new HttpException(
        'فشل في جلب تاريخ المحادثة',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * إرسال رسالة
   */
  @Post('message')
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @Request() req: any,
  ) {
    try {
      const userId = req.user.sub;
      return await this.chatService.sendMessage(userId, sendMessageDto);
    } catch (error) {
      throw new HttpException(
        'فشل في إرسال الرسالة',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * حذف جلسة محادثة
   */
  @Delete('session/:sessionId')
  async deleteSession(
    @Param('sessionId') sessionId: string,
    @Request() req: any,
  ) {
    try {
      const userId = req.user.sub;
      await this.chatService.deleteSession(sessionId, userId);
      return { success: true, message: 'تم حذف الجلسة بنجاح' };
    } catch (error) {
      throw new HttpException(
        'فشل في حذف الجلسة',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * إيقاف توليد الرسالة
   */
  @Post('stop/:sessionId')
  async stopGeneration(
    @Param('sessionId') sessionId: string,
    @Request() req: any,
  ) {
    try {
      const userId = req.user.sub;
      await this.chatService.stopGeneration(sessionId, userId);
      return { success: true, message: 'تم إيقاف التوليد' };
    } catch (error) {
      throw new HttpException(
        'فشل في إيقاف التوليد',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * تحديث عنوان الجلسة
   */
  @Post('session/:sessionId/title')
  async updateSessionTitle(
    @Param('sessionId') sessionId: string,
    @Body('title') title: string,
    @Request() req: any,
  ) {
    try {
      const userId = req.user.sub;
      return await this.chatService.updateSessionTitle(sessionId, title, userId);
    } catch (error) {
      throw new HttpException(
        'فشل في تحديث عنوان الجلسة',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}