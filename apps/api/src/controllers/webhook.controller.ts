import { Request, Response } from 'express';
import { PubSub } from '@google-cloud/pubsub';
import * as crypto from 'crypto';

export class WebhookController {
  private pubsub = new PubSub();
  private topicName = 'lead-events';

  async handleWebhook(req: Request, res: Response) {
    const source = req.params.source;
    
    try {
      // التحقق من المصدر والأمان
      const isValid = await this.validateWebhook(source, req);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid webhook signature' });
      }

      // توحيد البيانات
      const unifiedPayload = this.unifyPayload(source, req.body);
      
      // إرسال إلى Pub/Sub
      await this.publishToQueue(unifiedPayload);
      
      res.status(200).json({ status: 'ok', processed: true });
    } catch (error) {
      console.error(`Webhook error for ${source}:`, error);
      res.status(500).json({ error: 'Processing failed' });
    }
  }

  private async validateWebhook(source: string, req: Request): Promise<boolean> {
    switch (source) {
      case 'meta':
        return this.validateMetaWebhook(req);
      case 'odoo':
        return this.validateOdooWebhook(req);
      default:
        return false;
    }
  }

  private validateMetaWebhook(req: Request): boolean {
    const signature = req.headers['x-hub-signature-256'] as string;
    const secret = process.env.META_WEBHOOK_SECRET;
    
    if (!signature || !secret) return false;
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    return signature === `sha256=${expectedSignature}`;
  }

  private validateOdooWebhook(req: Request): boolean {
    const signature = req.headers['x-g-assistant-signature'] as string;
    const secret = process.env.ODOO_WEBHOOK_SECRET;
    
    if (!signature || !secret) return false;
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    return signature === `sha256=${expectedSignature}`;
  }

  private unifyPayload(source: string, payload: any) {
    const unified = {
      source,
      timestamp: new Date().toISOString(),
      event_type: this.getEventType(source, payload),
      data: this.extractLeadData(source, payload)
    };
    
    return unified;
  }

  private getEventType(source: string, payload: any): string {
    if (source === 'meta') {
      return payload.entry?.[0]?.changes?.[0]?.field === 'leadgen' ? 'lead_created' : 'unknown';
    }
    if (source === 'odoo') {
      return payload.event || 'lead_updated';
    }
    return 'unknown';
  }

  private extractLeadData(source: string, payload: any) {
    if (source === 'meta') {
      const leadData = payload.entry?.[0]?.changes?.[0]?.value;
      return {
        leadgen_id: leadData?.leadgen_id,
        ad_id: leadData?.ad_id,
        form_id: leadData?.form_id,
        created_time: leadData?.created_time
      };
    }
    
    if (source === 'odoo') {
      return payload.data;
    }
    
    return payload;
  }

  private async publishToQueue(payload: any) {
    const topic = this.pubsub.topic(this.topicName);
    const messageBuffer = Buffer.from(JSON.stringify(payload));
    
    await topic.publishMessage({
      data: messageBuffer,
      attributes: {
        source: payload.source,
        event_type: payload.event_type
      }
    });
  }
}
