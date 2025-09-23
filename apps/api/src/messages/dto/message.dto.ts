import { IsString, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Chat session ID' })
  @IsUUID()
  chatId: string;
}