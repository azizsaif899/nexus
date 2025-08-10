import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryDto {
  @ApiProperty({ 
    example: 'ما هي أفضل الممارسات لتطوير التطبيقات؟', 
    description: 'The AI query prompt' 
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({ 
    example: 'development', 
    description: 'Context for the query',
    required: false 
  })
  @IsString()
  @IsOptional()
  context?: string;

  @ApiProperty({ 
    example: 'ar', 
    description: 'Response language',
    required: false 
  })
  @IsString()
  @IsOptional()
  language?: string;
}