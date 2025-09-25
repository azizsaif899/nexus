import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  @Post()
  async createMessage(@Body() messageDto: any, @Request() req) {
    return {
      id: Date.now().toString(),
      content: messageDto.content,
      sessionId: messageDto.sessionId,
      userId: req.user.id,
      timestamp: new Date().toISOString(),
      type: 'user'
    };
  }

  @Get()
  async getMessages(@Query('sessionId') sessionId: string, @Request() req) {
    return {
      messages: [],
      sessionId,
      userId: req.user.id,
      total: 0
    };
  }

  @Get(':messageId')
  async getMessage(@Param('messageId') messageId: string, @Request() req) {
    return {
      id: messageId,
      content: 'Sample message',
      userId: req.user.id,
      timestamp: new Date().toISOString()
    };
  }

  @Put(':messageId')
  async updateMessage(
    @Param('messageId') messageId: string,
    @Body() updateDto: any,
    @Request() req
  ) {
    return {
      id: messageId,
      content: updateDto.content,
      userId: req.user.id,
      updated: true
    };
  }

  @Delete(':messageId')
  async deleteMessage(@Param('messageId') messageId: string, @Request() req) {
    return {
      id: messageId,
      deleted: true,
      userId: req.user.id
    };
  }
}