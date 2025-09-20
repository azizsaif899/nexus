const { LeadProcessingService } = require('@g-assistant/core-logic');
const { OdooClient } = require('@g-assistant/odoo-client');

// Google Cloud Function لمعالجة أحداث العملاء المحتملين
exports.leadEventHandler = async (message, context) => {
  // Removed console.log

  try {
    // فك تشفير الرسالة من Pub/Sub
    const payload = JSON.parse(Buffer.from(message.data, 'base64').toString());
    
    // Removed console.log

    // إنشاء خدمة معالجة العملاء المحتملين
    const odooClient = new OdooClient({
      url: process.env.ODOO_URL,
      database: process.env.ODOO_DATABASE,
      username: process.env.ODOO_USERNAME,
      password: process.env.ODOO_PASSWORD
    });

    const leadProcessor = new LeadProcessingService(odooClient);

    // معالجة الحدث
    await leadProcessor.processWebhookEvent(payload);

    // Removed console.log
    
  } catch (error) {
    console.error('Error processing lead event:', error);
    
    // في حالة الخطأ، يمكن إعادة المحاولة أو إرسال تنبيه
    if (error.retryable) {
      throw error; // سيؤدي إلى إعادة المحاولة التلقائية
    }
    
    // تسجيل الخطأ في نظام المراقبة
    await logError(error, payload);
  }
};

// دالة مساعدة لتسجيل الأخطاء
async function logError(error, payload) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    payload,
    function_name: 'leadEventHandler'
  };

  console.error('Error logged:', errorLog);
  
  // يمكن إرسال التنبيه إلى Slack أو البريد الإلكتروني هنا
}