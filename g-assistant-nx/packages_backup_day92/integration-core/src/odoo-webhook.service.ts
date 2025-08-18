
import { Injectable } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';

@Injectable()
export class OdooWebhookService {
  private pubSubClient: PubSub;

  constructor() {
    this.pubSubClient = new PubSub();
  }

  async processWebhook(payload: any) {
    const topicName = 'odoo-updates';
    const dataBuffer = Buffer.from(JSON.stringify(payload));

    try {
      const messageId = await this.pubSubClient.topic(topicName).publishMessage({ data: dataBuffer });
      console.log(`Message ${messageId} published.`);
      return { success: true, messageId };
    } catch (error) {
      console.error(`Received error while publishing: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}
