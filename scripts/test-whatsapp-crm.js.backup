/**
 * Test WhatsApp CRM Integration
 * اختبار تكامل WhatsApp مع CRM
 */

const { WhatsAppCRMBridge } = require('../packages/odoo-integration/src/whatsapp-crm-bridge');

async function testWhatsAppCRM() {
  // Removed console.log

  const bridge = new WhatsAppCRMBridge();

  try {
    // محاكاة رسائل WhatsApp
    const testMessages = [
      {
        from: '+966501234567',
        name: 'أحمد محمد',
        message: 'مرحباً، أريد الاستفسار عن خدماتكم',
        timestamp: new Date()
      },
      {
        from: '+966507654321',
        name: 'فاطمة علي',
        message: 'هل يمكنني الحصول على عرض سعر؟',
        timestamp: new Date()
      },
      {
        from: '+966509876543',
        name: 'محمد سالم',
        message: 'أريد حجز موعد للاستشارة',
        timestamp: new Date()
      }
    ];

    // Removed console.log

    for (const message of testMessages) {
      await bridge.processWhatsAppMessage(message);
      // Removed console.log
    }

    // اختبار الإحصائيات
    // Removed console.log
    const stats = await bridge.getCRMStats();
    
    // Removed console.log
    // Removed console.log
    // Removed console.log
    // Removed console.log
    // Removed console.log
    // Removed console.log

    // Removed console.log
    // Removed console.log
    // Removed console.log
    // Removed console.log
    // Removed console.log
    // Removed console.log
    
    // Removed console.log
    // Removed console.log
    // Removed console.log
    // Removed console.log

  } catch (error) {
    console.error('❌ فشل الاختبار:', error.message);
  }
}

// تشغيل الاختبار
testWhatsAppCRM();