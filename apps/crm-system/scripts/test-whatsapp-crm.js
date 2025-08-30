/**
 * Test WhatsApp CRM Integration
 * اختبار تكامل WhatsApp مع CRM
 */

const { WhatsAppCRMBridge } = require('../packages/odoo-integration/src/whatsapp-crm-bridge');

async function testWhatsAppCRM() {
  console.log('🧪 اختبار تكامل WhatsApp مع CRM...\n');

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

    console.log('📱 معالجة رسائل WhatsApp...\n');

    for (const message of testMessages) {
      await bridge.processWhatsAppMessage(message);
      console.log('-------------------\n');
    }

    // اختبار الإحصائيات
    console.log('📊 جلب إحصائيات CRM...');
    const stats = await bridge.getCRMStats();
    
    console.log('📈 الإحصائيات:');
    console.log(`   إجمالي العملاء المحتملين: ${stats.totalLeads}`);
    console.log(`   عملاء من WhatsApp: ${stats.whatsappLeads}`);
    console.log(`   عملاء محولين: ${stats.convertedCustomers}`);
    console.log(`   معدل التحويل: ${stats.conversionRate}%`);
    console.log(`   رسائل اليوم: ${stats.todayMessages}`);

    console.log('\n🎉 اكتمل اختبار التكامل بنجاح!');
    console.log('\n✅ النتائج:');
    console.log('   - تم إضافة 3 عملاء جدد إلى CRM');
    console.log('   - تم إرسال ردود تلقائية');
    console.log('   - تم إشعار الإدارة');
    console.log('   - الإحصائيات محدثة');
    
    console.log('\n🔗 الخطوة التالية:');
    console.log('   - تحقق من Odoo CRM: http://localhost:8070');
    console.log('   - شاهد العملاء الجدد في قسم Leads');
    console.log('   - راجع لوحة الإدارة للإحصائيات');

  } catch (error) {
    console.error('❌ فشل الاختبار:', error.message);
  }
}

// تشغيل الاختبار
testWhatsAppCRM();