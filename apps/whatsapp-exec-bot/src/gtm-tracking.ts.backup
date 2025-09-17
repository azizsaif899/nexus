/**
 * WhatsApp GTM Tracking Integration
 */

import { trackWhatsAppLead, trackCRMConversion } from '../../admin-dashboard/src/gtm-integration';

export class WhatsAppGTMTracker {
  
  /**
   * تتبع رسالة WhatsApp جديدة
   */
  async trackNewMessage(message: any): Promise<void> {
    try {
      // تتبع الرسالة في GTM
      trackWhatsAppLead({
        id: `whatsapp_${Date.now()}`,
        phone: message.from,
        name: message.name || message.from,
        message: message.text,
        timestamp: new Date()
      });

      // Removed console.log
      
    } catch (error) {
      console.error('❌ خطأ في تتبع GTM:', error);
    }
  }

  /**
   * تتبع تحويل عميل WhatsApp لعميل CRM
   */
  async trackLeadConversion(leadData: any): Promise<void> {
    try {
      trackCRMConversion({
        customerId: leadData.id,
        source: 'whatsapp',
        amount: leadData.estimatedValue || 0,
        conversionType: 'lead_to_customer'
      });

      // Removed console.log
      
    } catch (error) {
      console.error('❌ خطأ في تتبع التحويل:', error);
    }
  }

  /**
   * تتبع رد تلقائي
   */
  async trackAutoReply(phone: string): Promise<void> {
    try {
      // تتبع الرد التلقائي
      const { gtm } = await import('../../admin-dashboard/src/gtm-integration');
      
      gtm.trackEvent({
        event: 'auto_reply_sent',
        eventCategory: 'WhatsApp',
        eventAction: 'auto_reply',
        eventLabel: phone,
        customParameters: {
          timestamp: new Date().toISOString(),
          source: 'azizsys_bot'
        }
      });

      // Removed console.log
      
    } catch (error) {
      console.error('❌ خطأ في تتبع الرد التلقائي:', error);
    }
  }
}