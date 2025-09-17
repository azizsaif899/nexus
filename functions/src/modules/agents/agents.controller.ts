import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { AgentsService } from './agents.service';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post(':agentId/memory')
  async saveAgentMemory(@Param('agentId') agentId: string, @Body() memory: any) {
    try {
      const result = await this.agentsService.saveAgentMemory(agentId, memory);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get(':agentId/memory')
  async getAgentMemory(@Param('agentId') agentId: string) {
    try {
      const memory = await this.agentsService.getAgentMemory(agentId);
      return { success: true, data: memory };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Post(':agentId/conversations')
  async saveConversation(@Param('agentId') agentId: string, @Body() conversation: any) {
    try {
      const result = await this.agentsService.saveConversation(agentId, conversation);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get(':agentId/conversations')
  async getConversations(@Param('agentId') agentId: string) {
    try {
      const conversations = await this.agentsService.getConversations(agentId);
      return { success: true, data: conversations, count: conversations.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Put(':agentId/status')
  async updateAgentStatus(@Param('agentId') agentId: string, @Body() body: { status: string }) {
    try {
      const result = await this.agentsService.updateAgentStatus(agentId, body.status);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get(':agentId/status')
  async getAgentStatus(@Param('agentId') agentId: string) {
    try {
      const status = await this.agentsService.getAgentStatus(agentId);
      return { success: true, data: status };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}