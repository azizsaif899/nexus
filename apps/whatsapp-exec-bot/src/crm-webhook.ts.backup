/**
 * WhatsApp CRM Webhook - استقبال رسائل الواتساب وإرسالها للـ CRM
 */

import { WhatsAppCRMBridge } from '../../../packages/odoo-integration/src/whatsapp-crm-bridge';

export class WhatsAppCRMWebhook {
  private crmBridge = new WhatsAppCRMBridge();

  /**
   * معالجة webhook من WhatsApp
   */
  async handleWebhook(req: any, res: any): Promise<void> {
    try {
      const { messages } = req.body;
      
      if (messages && messages.length > 0) {
        for (const message of messages) {
          await this.processMessage(message);
        }
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('❌ خطأ في webhook:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * معالجة رسالة واحدة
   */
  private async processMessage(message: any): Promise<void> {
    const whatsappMessage = {
      from: message.from,
      name: message.profile?.name || message.from,
      message: message.text?.body || 'رسالة غير نصية',
      timestamp: new Date(message.timestamp * 1000)
    };

    // إرسال للـ CRM
    await this.crmBridge.processWhatsAppMessage(whatsappMessage);

    // رد تلقائي للعميل
    await this.sendAutoReply(message.from, whatsappMessage.name);
  }

  /**
   * رد تلقائي للعميل
   */
  private async sendAutoReply(to: string, name: string): Promise<void> {
    const replyMessage = `
مرحباً ${name}! 👋

شكراً لتواصلك معنا. تم استلام رسالتك وسيتم الرد عليك في أقرب وقت.

✅ تم إضافتك إلى نظام إدارة العملاء
📞 سيتواصل معك فريقنا قريباً

مع تحيات فريق AzizSys 🚀
    `;

    // Removed console.log
    
    // هنا سيتم إرسال الرسالة عبر WhatsApp API
    // await whatsappAPI.sendMessage(to, replyMessage);
  }
}