/**
 * Test Odoo Integration
 * اختبار تكامل Odoo مع AzizSys
 */

const { OdooConnector } = require('../packages/odoo-integration/src/odoo-connector');

async function testOdooIntegration() {
  console.log('🧪 اختبار تكامل Odoo...');

  const odoo = new OdooConnector({
    url: 'http://localhost:8070',
    database: 'azizsys_crm',
    username: 'admin',
    password: 'AzizSys2025!'
  });

  try {
    // اختبار إضافة عميل جديد
    console.log('➕ اختبار إضافة عميل جديد...');
    const customerId = await odoo.addCustomerFromWhatsApp({
      name: 'عميل تجريبي من AzizSys',
      phone: '+966501234567',
      email: 'test@azizsys.com',
      source: 'whatsapp',
      status: 'lead'
    });

    console.log(`✅ تم إضافة العميل بنجاح - ID: ${customerId}`);

    // اختبار الحصول على تقرير
    console.log('📊 اختبار جلب التقارير...');
    const report = await odoo.getSalesReport();
    console.log('📈 تقرير المبيعات:', report);

    console.log('🎉 اكتمل الاختبار بنجاح!');
    
  } catch (error) {
    console.error('❌ فشل الاختبار:', error.message);
  }
}

// تشغيل الاختبار
testOdooIntegration();