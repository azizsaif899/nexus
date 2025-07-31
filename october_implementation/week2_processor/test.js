// test.js - اختبارات سريعة
const axios = require('axios');

const API_BASE = 'http://localhost:8081';

async function runTests() {
  console.log('🧪 اختبار المعالجات...\n');

  try {
    // اختبار فحص الصحة
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check:', health.data.status);

    // اختبار معالجة فاتورة
    const invoice = {
      amount: 1000,
      description: 'مستلزمات مكتبية',
      vendor: 'شركة التوريد'
    };

    const result = await axios.post(`${API_BASE}/process/invoice`, invoice);
    console.log('✅ Invoice processing:', result.data.success);
    console.log('   VAT:', result.data.data.vatAmount);
    console.log('   Category:', result.data.data.category);

    // اختبار المؤشرات
    const metrics = await axios.get(`${API_BASE}/metrics`);
    console.log('✅ Metrics:', metrics.data.totalRequests, 'requests');

    console.log('\n🎉 جميع الاختبارات نجحت!');
    process.exit(0);

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
    process.exit(1);
  }
}

// تشغيل الاختبارات إذا كان الخادم يعمل
setTimeout(runTests, 2000);