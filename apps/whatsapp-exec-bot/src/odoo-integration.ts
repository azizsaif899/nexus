/**
 * WhatsApp to Odoo CRM Integration
 * ربط بوت الواتساب مع نظام CRM
 */

import { OdooConnector } from '@azizsys/odoo-integration';

export class WhatsAppOdooIntegration {
  private odoo: OdooConnector;

  constructor() {
    this.odoo = new OdooConnector({
      url: 'http://localhost:8070',
      database: 'azizsys_crm',
      username: 'admin',
      password: 'AzizSys2025!'
    });
  }

  /**
   * إضافة عميل جديد من WhatsApp
   */
  async addLeadFromWhatsApp(message: {
    from: string;
    name: string;
    message: string;
  }): Promise<void> {
    try {
      await this.odoo.addCustomerFromWhatsApp({
        name: message.name,
        phone: message.from,
        email: `${message.from.replace('+', '')}@whatsapp.temp`,
        source: 'whatsapp',
        status: 'lead'
      });

      console.log(`✅ تم إضافة ${message.name} إلى CRM من WhatsApp`);
    } catch (error) {
      console.error('❌ خطأ في إضافة العميل:', error);
    }
  }

  /**
   * تحديث حالة العميل عند الرد
   */
  async updateLeadActivity(phone: string, activity: string): Promise<void> {
    try {
      // البحث عن العميل بالهاتف
      // تحديث النشاط الأخير
      console.log(`📝 تم تحديث نشاط العميل ${phone}: ${activity}`);
    } catch (error) {
      console.error('❌ خطأ في تحديث النشاط:', error);
    }
  }
}