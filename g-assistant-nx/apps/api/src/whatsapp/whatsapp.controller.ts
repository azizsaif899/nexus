import { Controller, Post, Get, Body, Query, Headers, HttpStatus, HttpException } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';

@Controller('webhook/whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string
  ): string {
    const result = this.whatsappService.verifyWebhook(mode, token, challenge);
    if (!result) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return result;
  }

  @Post()
  async handleWebhook(
    @Body() body: any,
    @Headers('x-hub-signature-256') signature: string
  ): Promise<{ status: string }> {
    try {
      await this.whatsappService.processWebhook(body, signature);
      return { status: 'success' };
    } catch (error) {
      console.error('Webhook processing error:', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}