import * as crypto from 'crypto';

export interface WebhookEvent {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: any;
        contacts?: any[];
        messages?: any[];
        statuses?: any[];
      };
      field: string;
    }>;
  }>;
}

export class WebhookValidator {
  constructor(private verifyToken: string, private appSecret: string) {}

  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    if (mode === 'subscribe' && token === this.verifyToken) {
      return challenge;
    }
    return null;
  }

  validateSignature(payload: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', this.appSecret)
      .update(payload)
      .digest('hex');
    
    return signature === `sha256=${expectedSignature}`;
  }

  parseWebhookEvent(body: any): WebhookEvent | null {
    if (!body.object || body.object !== 'whatsapp_business_account') {
      return null;
    }
    return body as WebhookEvent;
  }

  extractMessages(event: WebhookEvent): any[] {
    const messages: any[] = [];
    
    event.entry?.forEach(entry => {
      entry.changes?.forEach(change => {
        if (change.value.messages) {
          messages.push(...change.value.messages);
        }
      });
    });
    
    return messages;
  }
}