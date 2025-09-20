import { WhatsAppCore, WhatsAppConfig, MessageHandler, WhatsAppMessage, MessageResponse } from '@g-assistant-nx/whatsapp-core';
import { AIQueryHandler } from './ai-query-handler';

export class QueryBotMessageHandler extends MessageHandler {
  private aiQueryHandler: AIQueryHandler;

  constructor() {
    super();
    this.aiQueryHandler = new AIQueryHandler();
  }

  async processMessage(message: WhatsAppMessage): Promise<MessageResponse | null> {
    if (!this.validateMessage(message)) {
      return null;
    }

    const query = message.text?.trim();
    if (!query) {
      return {
        to: message.from,
        text: 'مرحباً! أرسل لي سؤالك وسأحاول الإجابة عليه.',
        type: 'text'
      };
    }

    try {
      const result = await this.aiQueryHandler.processQuery(query, message.from);
      
      let responseText = result.answer;
      
      // إضافة الاقتراحات إذا كانت متوفرة
      if (result.suggestions && result.suggestions.length > 0) {
        responseText += '\n\n💡 اقتراحات:\n' + result.suggestions.map(s => `• ${s}`).join('\n');
      }

      // إضافة مؤشر الثقة إذا كان منخفضاً
      if (result.confidence < 0.5) {
        responseText += '\n\n⚠️ قد تحتاج إلى توضيح أكثر للحصول على إجابة أفضل.';
      }

      return {
        to: message.from,
        text: responseText,
        type: 'text'
      };
    } catch (error) {
      console.error('Error processing query:', error);
      return {
        to: message.from,
        text: 'عذراً، حدث خطأ أثناء معالجة استعلامك. يرجى المحاولة مرة أخرى.',
        type: 'text'
      };
    }
  }
}

export class WhatsAppQueryBot {
  private whatsappCore: WhatsAppCore;

  constructor(config: WhatsAppConfig) {
    this.whatsappCore = new WhatsAppCore(config);
    // تخصيص معالج الرسائل
    (this.whatsappCore as any).messageHandler = new QueryBotMessageHandler();
  }

  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    return this.whatsappCore.verifyWebhook(mode, token, challenge);
  }

  async processWebhook(body: any, signature: string): Promise<void> {
    const responses = await this.whatsappCore.processWebhook(body, signature);
    
    for (const response of responses) {
      await this.whatsappCore.sendMessage(response);
    }
  }
}