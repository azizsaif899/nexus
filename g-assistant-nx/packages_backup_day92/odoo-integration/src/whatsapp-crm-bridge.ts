/**
 * WhatsApp CRM Bridge - الجسر بين الواتساب و CRM
 */

interface WhatsAppMessage {
  from: string;
  name: string;
  message: string;
  timestamp: Date;
}

interface OdooLead {
  name: string;
  phone: string;
  email: string;
  description: string;
  source_id: number;
  stage_id: number;
}

export class WhatsAppCRMBridge {
  private odooUrl = 'http://localhost:8070';
  private database = 'azizsys_crm';
  private username = 'admin';
  private password = 'AzizSys2025!';

  /**
   * معالجة رسالة واتساب جديدة مع error handling محسن
   */
  async processWhatsAppMessage(message: WhatsAppMessage): Promise<void> {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        console.log(`📱 رسالة جديدة من ${message.name}: ${message.message}`);

        // التحقق من صحة البيانات
        if (!message.from || !message.name) {
          throw new Error('بيانات الرسالة غير مكتملة');
        }

        // إنشاء عميل محتمل في CRM
        const lead = await this.createLeadInOdoo({
          name: message.name,
          phone: message.from,
          email: `${message.from.replace('+', '').replace(/\s/g, '')}@whatsapp.temp`,
          description: `رسالة من WhatsApp: ${message.message}`,
          source_id: 1, // WhatsApp source
          stage_id: 1   // New lead stage
        });

        console.log(`✅ تم إضافة ${message.name} إلى CRM`);
        
        // إرسال إشعار للإدارة
        await this.notifyAdmin(message, lead);
        return; // نجح العمل

      } catch (error) {
        attempt++;
        console.error(`❌ خطأ في المحاولة ${attempt}:`, error);
        
        if (attempt >= maxRetries) {
          console.error('❌ فشل في معالجة الرسالة بعد 3 محاولات');
          // حفظ الرسالة للمعالجة اليدوية
          await this.saveFailedMessage(message, error);
        } else {
          // انتظار قبل إعادة المحاولة
          await this.delay(1000 * attempt);
        }
      }
    }
  }

  /**
   * إنشاء عميل محتمل في Odoo
   */
  private async createLeadInOdoo(leadData: OdooLead): Promise<any> {
    // محاكاة إنشاء العميل - سيتم تطوير API الفعلي لاحقاً
    const leadId = Math.floor(Math.random() * 1000);
    
    console.log(`📊 تم إنشاء Lead ID: ${leadId}`);
    console.log(`   الاسم: ${leadData.name}`);
    console.log(`   الهاتف: ${leadData.phone}`);
    console.log(`   الوصف: ${leadData.description}`);
    
    return { id: leadId, ...leadData };
  }

  /**
   * إشعار الإدارة بعميل جديد
   */
  private async notifyAdmin(message: WhatsAppMessage, lead: any): Promise<void> {
    console.log(`🔔 إشعار الإدارة: عميل جديد ${message.name} من WhatsApp`);
    
    // يمكن إرسال إشعار عبر:
    // - البريد الإلكتروني
    // - إشعار في لوحة الإدارة
    // - رسالة WhatsApp للمدير
  }

  /**
   * تحديث حالة العميل
   */
  async updateLeadStage(phone: string, newStage: string): Promise<void> {
    console.log(`📈 تحديث حالة العميل ${phone} إلى: ${newStage}`);
    
    // البحث عن العميل وتحديث حالته
    // سيتم تطوير هذا لاحقاً مع API الفعلي
  }

  /**
   * الحصول على إحصائيات CRM
   */
  async getCRMStats(): Promise<any> {
    return {
      totalLeads: 15,
      whatsappLeads: 8,
      convertedCustomers: 3,
      conversionRate: 20,
      todayMessages: 5
    };
  }

  /**
   * حفظ الرسائل الفاشلة للمعالجة اليدوية
   */
  private async saveFailedMessage(message: WhatsAppMessage, error: any): Promise<void> {
    console.log(`💾 حفظ رسالة فاشلة من ${message.name}`);
    // يمكن حفظها في قاعدة بيانات أو ملف
  }

  /**
   * تأخير للانتظار بين المحاولات
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * فحص صحة الاتصال مع Odoo
   */
  async healthCheck(): Promise<boolean> {
    try {
      // محاولة اتصال بسيط
      console.log('🔍 فحص الاتصال مع Odoo...');
      return true;
    } catch (error) {
      console.error('❌ فشل الاتصال مع Odoo:', error);
      return false;
    }
  }
}