import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueryService } from './query.service';
import { QueryDto } from './dto/query.dto';

@ApiTags('AI Query')
@Controller('query')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Send AI query',
    description: 'Process AI query and return intelligent response. Supports Arabic and English.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Query processed successfully',
    example: {
      success: true,
      query: 'ما هي أفضل الممارسات في البرمجة؟',
      response: 'بناءً على خبرتي في التطوير، أنصح باتباع أفضل الممارسات...',
      timestamp: '2025-01-09T14:30:00.000Z',
      processingTime: 1250,
      confidence: 85,
      context: 'development'
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid query format',
    example: {
      success: false,
      statusCode: 400,
      message: 'Validation failed',
      timestamp: '2025-01-09T14:30:00.000Z'
    }
  })
  async processQuery(@Body() queryDto: QueryDto) {
    return this.queryService.processQuery(queryDto);
  }

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze data with AI' })
  @ApiResponse({ status: 200, description: 'Analysis completed' })
  async analyzeData(@Body() data: any) {
    return this.queryService.analyzeData(data);
  }
}
