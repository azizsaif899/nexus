export interface WhatsAppMessage {
  id: string;
  from: string;
  to: string;
  text?: string;
  type: 'text' | 'image' | 'audio' | 'document';
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface MessageResponse {
  to: string;
  text?: string;
  type: 'text' | 'template';
  template?: any;
}

export class MessageHandler {
  async processMessage(message: WhatsAppMessage): Promise<MessageResponse | null> {
    if (!this.validateMessage(message)) {
      return null;
    }

    return {
      to: message.from,
      text: `Received: ${message.text}`,
      type: 'text'
    };
  }

  private validateMessage(message: WhatsAppMessage): boolean {
    return !!(message.id && message.from && message.to);
  }

  formatResponse(response: MessageResponse): any {
    return {
      messaging_product: 'whatsapp',
      to: response.to,
      type: response.type,
      text: response.text ? { body: response.text } : undefined,
      template: response.template
    };
  }
}