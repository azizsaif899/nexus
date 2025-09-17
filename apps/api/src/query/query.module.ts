import { Module } from '@nestjs/common';
import { QueryController } from './query.controller';
import { QueryService } from './query.service';
import { AiCoreService, GeminiClient } from '../mocks/core-logic.mock';

@Module({
  controllers: [QueryController],
  providers: [QueryService, AiCoreService, GeminiClient],
  exports: [QueryService],
})
export class QueryModule {}
