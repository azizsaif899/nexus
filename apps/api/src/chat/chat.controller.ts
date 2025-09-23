import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateChatDto, UpdateChatDto } from './dto/chat.dto';

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Create new chat session' })
  async createChat(@Body() createChatDto: CreateChatDto, @Request() req) {
    return this.chatService.create({
      ...createChatDto,
      userId: req.user.id
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get user chat sessions' })
  async getUserChats(@Request() req) {
    return this.chatService.findByUserId(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chat session by ID' })
  async getChatById(@Param('id') id: string, @Request() req) {
    return this.chatService.findOne(id, req.user.id);
  }

  @Post(':id/title')
  @ApiOperation({ summary: 'Update chat title' })
  async updateChatTitle(
    @Param('id') id: string,
    @Body() updateChatDto: UpdateChatDto,
    @Request() req
  ) {
    return this.chatService.updateTitle(id, updateChatDto.title, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete chat session' })
  async deleteChat(@Param('id') id: string, @Request() req) {
    return this.chatService.delete(id, req.user.id);
  }
}