import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateChatSessionDto {
  @IsString()
  @IsOptional()
  title?: string;
}

export class SendMessageDto {
  @IsString()
  content: string;

  @IsUUID()
  sessionId: string;

  @IsString()
  @IsOptional()
  role?: 'user' | 'assistant' = 'user';
}