import axios from 'axios';
import { WhatsAppMessage, WhatsAppWebhookData, ApiResponse } from '@azizsys/shared-types';

export class WhatsAppClient {
  private accessToken: string;
  private phoneNumberId: string;
  private baseUrl = 'https://graph.facebook.com/v18.0';

  constructor(config: {
    accessToken: string;
    phoneNumberId: string;
  }) {
    this.accessToken = config.accessToken;
    this.phoneNumberId = config.phoneNumberId;
  }

  async sendMessage(to: string, message: string): Promise<ApiResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          text: { body: message }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  parseWebhookData(webhookData: WhatsAppWebhookData): WhatsAppMessage[] {
    const messages: WhatsAppMessage[] = [];

    webhookData.entry?.forEach(entry => {
      entry.changes?.forEach(change => {
        const { messages: incomingMessages, contacts } = change.value;
        
        incomingMessages?.forEach(msg => {
          const contact = contacts?.find(c => c.wa_id === msg.from);
          messages.push({
            from: msg.from,
            name: contact?.profile?.name || 'Unknown',
            message: msg.message,
            timestamp: new Date(parseInt(msg.timestamp) * 1000)
          });
        });
      });
    });

    return messages;
  }

  async sendAutoReply(to: string): Promise<ApiResponse> {
    const autoReplyMessage = 'شكراً لتواصلك معنا! سيتم الرد عليك في أقرب وقت ممكن.';
    return this.sendMessage(to, autoReplyMessage);
  }
}