/**
 * Test Odoo Integration
 * اختبار تكامل Odoo مع AzizSys
 */

const { OdooConnector } = require('../packages/odoo-integration/src/odoo-connector');

async function testOdooIntegration() {
  // Removed console.log

  const odoo = new OdooConnector({
    url: 'http://localhost:8070',
    database: 'azizsys_crm',
    username: 'admin',
    password: 'AzizSys2025!'
  });

  try {
    // اختبار إضافة عميل جديد
    // Removed console.log
    const customerId = await odoo.addCustomerFromWhatsApp({
      name: 'عميل تجريبي من AzizSys',
      phone: '+966501234567',
      email: 'test@azizsys.com',
      source: 'whatsapp',
      status: 'lead'
    });

    // Removed console.log

    // اختبار الحصول على تقرير
    // Removed console.log
    const report = await odoo.getSalesReport();
    // Removed console.log

    // Removed console.log
    
  } catch (error) {
    console.error('❌ فشل الاختبار:', error.message);
  }
}

// تشغيل الاختبار
testOdooIntegration();