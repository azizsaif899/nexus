import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { QueriesService } from './queries.service';

@Controller('queries')
export class QueriesController {
  constructor(private readonly queriesService: QueriesService) {}

  @Post()
  async saveQuery(@Body() body: { 
    query: string; 
    response: string; 
    agentType: string; 
    userId?: string 
  }) {
    try {
      const result = await this.queriesService.saveQuery(
        body.query, 
        body.response, 
        body.agentType, 
        body.userId
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get()
  async getAllQueries(@Query('agentType') agentType?: string, @Query('userId') userId?: string) {
    try {
      let queries;
      if (agentType) {
        queries = await this.queriesService.getQueriesByAgent(agentType);
      } else if (userId) {
        queries = await this.queriesService.getQueriesByUser(userId);
      } else {
        queries = await this.queriesService.getAllQueries();
      }
      return { success: true, data: queries, count: queries.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get(':id')
  async getQueryById(@Param('id') id: string) {
    try {
      const query = await this.queriesService.getQueryById(id);
      if (!query) {
        return { success: false, error: 'Query not found' };
      }
      return { success: true, data: query };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}