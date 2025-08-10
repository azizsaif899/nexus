import { MessageHandler, WhatsAppMessage, MessageResponse } from './message-handler';
import { WebhookValidator, WebhookEvent } from './webhook-validator';
import { ResponseFormatter, FormattedResponse } from './response-formatter';
import { LoggingService } from './logging-service';

export interface WhatsAppConfig {
  verifyToken: string;
  accessToken: string;
  appSecret: string;
  phoneNumberId: string;
}

export class WhatsAppCore {
  private messageHandler: MessageHandler;
  private webhookValidator: WebhookValidator;
  private responseFormatter: ResponseFormatter;
  private logger: LoggingService;

  constructor(private config: WhatsAppConfig) {
    this.messageHandler = new MessageHandler();
    this.webhookValidator = new WebhookValidator(config.verifyToken, config.appSecret);
    this.responseFormatter = new ResponseFormatter();
    this.logger = new LoggingService();
  }

  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    return this.webhookValidator.verifyWebhook(mode, token, challenge);
  }

  async processWebhook(body: any, signature: string): Promise<FormattedResponse[]> {
    const bodyString = JSON.stringify(body);
    
    this.logger.info('Processing webhook', undefined, { bodySize: bodyString.length });
    
    if (!this.webhookValidator.validateSignature(bodyString, signature)) {
      this.logger.error('Invalid webhook signature');
      throw new Error('Invalid signature');
    }

    const event = this.webhookValidator.parseWebhookEvent(body);
    if (!event) {
      return [];
    }

    const messages = this.webhookValidator.extractMessages(event);
    const responses: FormattedResponse[] = [];

    for (const msg of messages) {
      const whatsappMessage: WhatsAppMessage = {
        id: msg.id,
        from: msg.from,
        to: msg.to || this.config.phoneNumberId,
        text: msg.text?.body,
        type: msg.type || 'text',
        timestamp: msg.timestamp || Date.now()
      };

      this.logger.info('Processing message', whatsappMessage.from, { messageId: msg.id, type: msg.type });
      
      const response = await this.messageHandler.processMessage(whatsappMessage);
      if (response) {
        responses.push(this.responseFormatter.formatTextMessage(response.to, response.text || ''));
        this.logger.info('Generated response', response.to);
      }
    }

    return responses;
  }

  async sendMessage(response: FormattedResponse): Promise<boolean> {
    try {
      const url = `https://graph.facebook.com/v18.0/${this.config.phoneNumberId}/messages`;
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(response)
      });
      
      if (result.ok) {
        this.logger.info('Message sent successfully', response.to);
      } else {
        this.logger.error('Failed to send message', response.to, { status: result.status });
      }
      
      return result.ok;
    } catch (error) {
      this.logger.error('Error sending WhatsApp message', response.to, { error: error.message });
      return false;
    }
  }

  getLogs(level?: 'info' | 'warn' | 'error' | 'debug', userId?: string, limit = 100) {
    return this.logger.getLogs(level, userId, limit);
  }
}
