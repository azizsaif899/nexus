// test_api.js - اختبار API Gateway
const axios = require('axios');

const API_BASE = process.env.API_BASE || 'http://localhost:8080';
const API_KEY = process.env.API_KEY || (() => {
  console.warn('⚠️ API_KEY not set in environment variables. Using development key.');
  return 'development-key-change-in-production';
})();

async function testAPI() {
  console.log('🧪 اختبار API Gateway...\n');

  try {
    // اختبار Health Check
    console.log('1️⃣ اختبار Health Check...');
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health Check:', health.data);

    // اختبار تقرير Sheets
    console.log('\n2️⃣ اختبار تقرير Sheets...');
    const reportResponse = await axios.post(`${API_BASE}/api/v1/process`, {
      type: 'report',
      data: {
        sheetId: 'test-sheet-id',
        range: 'A1:C10'
      }
    }, {
      headers: { 'X-API-Key': API_KEY }
    });
    console.log('✅ Report Response:', reportResponse.data);

    // اختبار تحليل AI
    console.log('\n3️⃣ اختبار تحليل AI...');
    const aiResponse = await axios.post(`${API_BASE}/api/v1/process`, {
      type: 'analyze',
      data: {
        prompt: 'حلل بيانات المبيعات الشهرية',
        context: 'financial_analysis'
      }
    }, {
      headers: { 'X-API-Key': API_KEY }
    });
    console.log('✅ AI Response:', aiResponse.data);

    console.log('\n🎉 جميع الاختبارات نجحت!');

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.response?.data || error.message);
  }
}

// تشغيل الاختبارات
testAPI();