import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateMessageDto } from './dto/message.dto';

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Send message to AI assistant' })
  async sendMessage(@Body() createMessageDto: CreateMessageDto, @Request() req) {
    return this.messagesService.sendMessage({
      ...createMessageDto,
      userId: req.user.id
    });
  }

  @Get('chat/:chatId')
  @ApiOperation({ summary: 'Get messages for chat session' })
  async getChatMessages(@Param('chatId') chatId: string, @Request() req) {
    return this.messagesService.findByChatId(chatId, req.user.id);
  }

  @Post('stop/:chatId')
  @ApiOperation({ summary: 'Stop message generation' })
  async stopGeneration(@Param('chatId') chatId: string, @Request() req) {
    return this.messagesService.stopGeneration(chatId, req.user.id);
  }
}