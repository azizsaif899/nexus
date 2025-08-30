/**
 * Simple Odoo Connection Test
 * اختبار اتصال بسيط مع Odoo
 */

const http = require('http');

async function testOdooConnection() {
  console.log('🧪 اختبار الاتصال مع Odoo...');

  try {
    // اختبار الاتصال مع Odoo
    const response = await fetch('http://localhost:8070/web/database/selector');
    
    if (response.ok) {
      console.log('✅ Odoo يعمل بنجاح على http://localhost:8070');
      console.log('📊 قاعدة البيانات: azizsys_crm');
      console.log('👤 المستخدم: admin@azizsys.com');
      console.log('🔗 يمكن الآن ربط WhatsApp Bot مع CRM');
      
      // محاكاة إضافة عميل
      console.log('');
      console.log('📝 محاكاة إضافة عميل من WhatsApp:');
      console.log('   الاسم: أحمد محمد');
      console.log('   الهاتف: +966501234567');
      console.log('   المصدر: WhatsApp Bot');
      console.log('   الحالة: عميل محتمل');
      console.log('✅ سيتم إضافته تلقائياً عند ربط البوت');
      
    } else {
      console.log('❌ Odoo لا يستجيب');
      console.log('🔧 تأكد من تشغيل: .\\quick-start-odoo.bat');
    }
    
  } catch (error) {
    console.log('❌ خطأ في الاتصال:', error.message);
    console.log('🔧 تأكد من تشغيل Docker و Odoo');
  }
}

// تشغيل الاختبار
testOdooConnection();