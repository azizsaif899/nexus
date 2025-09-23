import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({ description: 'Chat title', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;
}

export class UpdateChatDto {
  @ApiProperty({ description: 'New chat title' })
  @IsString()
  @MaxLength(100)
  title: string;
}