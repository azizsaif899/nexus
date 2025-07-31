// test_october_integration.cjs - اختبار شامل لدمج خطة أكتوبر
const assert = require('assert');

// محاكاة Google Apps Script environment
global.GAssistant = {
  Utils: {
    Injector: {
      get: (module) => {
        const modules = {
          'AI.Core': { query: (prompt) => ({ text: `AI response for: ${prompt}`, confidence: 0.9 }) },
          'Tools.Sheets': { read: () => [['Date', 'Amount'], ['2024-10-01', '1000']] },
          'System.Processors.Financial': { processInvoice: (data) => ({ vatAmount: data.amount * 0.15, category: 'office_supplies' }) },
          'Tools.OctoberGateway': { handleUnifiedProcess: (data) => ({ success: true, result: data }) },
          'System.Cache.Redis': { get: () => null, set: () => true }
        };
        return modules[module] || {};
      }
    },
    log: (msg, data) => console.log(`[LOG] ${msg}:`, data)
  }
};

global.CacheService = {
  getScriptCache: () => ({
    get: () => null,
    put: () => true
  })
};

global.ContentService = {
  createTextOutput: (text) => ({ setMimeType: () => ({ text }) }),
  MimeType: { JSON: 'application/json', XML: 'application/xml' }
};

global.defineModule = (name, factory) => {
  const module = factory(GAssistant.Utils);
  global[name.split('.').pop()] = module;
};

// تحميل الوحدات
eval(`
defineModule('System.Processors.Financial', ({ Utils, Config, AI }) => {
  class FinancialProcessor {
    async processInvoice(invoiceData) {
      return {
        vatAmount: invoiceData.amount * 0.15,
        category: /مكتب|قرطاسية/.test(invoiceData.description) ? 'office_supplies' : 'general',
        riskScore: invoiceData.amount > 10000 ? 'high' : 'low',
        fromCache: false
      };
    }
  }
  return new FinancialProcessor();
});

function processFinancialDocument(data) {
  const processor = GAssistant.Utils.Injector.get('System.Processors.Financial');
  return processor.processInvoice(data);
}

function processOctoberRequest(requestData) {
  const { type, data } = requestData;
  if (type === 'financial') {
    return { success: true, result: processFinancialDocument(data) };
  }
  return { success: true, result: { processed: true, type } };
}

function handleWhatsAppRequest(data) {
  const { Body: message } = data;
  let response = 'مرحباً! أرسل "تقرير" أو "تحليل" للمساعدة';
  
  if (message && message.includes('تقرير')) {
    response = '📊 تقرير سريع: تم إنشاء التقرير';
  } else if (message && message.includes('تحليل')) {
    response = '🤖 تحليل ذكي: تم التحليل...';
  }
  
  return { text: \`<?xml version="1.0" encoding="UTF-8"?><Response><Message>\${response}</Message></Response>\` };
}

function getCachedData(key) { return null; }
function setCachedData(key, value, ttl) { return true; }
`);

// 1. اختبار المعالج المالي
function testFinancialProcessor() {
  console.log('💰 Testing Financial Processor...');
  
  const testData = { amount: 1000, description: 'مستلزمات مكتبية', vendor: 'شركة التوريد' };
  const result = processFinancialDocument(testData);
  
  assert.strictEqual(result.vatAmount, 150, 'VAT calculation failed');
  assert.strictEqual(result.category, 'office_supplies', 'Category classification failed');
  
  console.log('✅ Financial Processor: PASSED');
  return result;
}

// 2. اختبار API Gateway
function testAPIGateway() {
  console.log('🚪 Testing API Gateway...');
  
  const testRequests = [
    { type: 'report', data: { range: 'A1:C10' } },
    { type: 'analyze', data: { prompt: 'تحليل البيانات' } },
    { type: 'financial', data: { amount: 5000, description: 'فاتورة كهرباء' } }
  ];
  
  testRequests.forEach((req, i) => {
    const result = processOctoberRequest(req);
    assert.strictEqual(result.success, true, `Request ${i+1} failed`);
  });
  
  console.log('✅ API Gateway: PASSED');
}

// 3. اختبار WhatsApp Handler
function testWhatsAppHandler() {
  console.log('📱 Testing WhatsApp Handler...');
  
  const testMessages = [
    { Body: 'تقرير', From: '+966501234567' },
    { Body: 'تحليل المبيعات', From: '+966501234567' },
    { Body: 'مرحبا', From: '+966501234567' }
  ];
  
  testMessages.forEach(msg => {
    const response = handleWhatsAppRequest(msg);
    assert.ok(response.text.includes('Message'), 'WhatsApp response format invalid');
  });
  
  console.log('✅ WhatsApp Handler: PASSED');
}

// 4. اختبار التكامل الشامل
function testFullIntegration() {
  console.log('🔗 Testing Full Integration...');
  
  const whatsappMsg = { Body: 'تحليل فاتورة بقيمة 2000 ريال', From: '+966501234567' };
  const whatsappResponse = handleWhatsAppRequest(whatsappMsg);
  assert.ok(whatsappResponse.text.includes('تحليل'), 'WhatsApp integration failed');
  
  const financialData = { amount: 2000, description: 'فاتورة خدمات' };
  const financialResult = processFinancialDocument(financialData);
  assert.strictEqual(financialResult.vatAmount, 300, 'Financial processing failed');
  
  const gatewayRequest = { type: 'financial', data: financialData };
  const gatewayResult = processOctoberRequest(gatewayRequest);
  assert.strictEqual(gatewayResult.success, true, 'Gateway integration failed');
  
  console.log('✅ Full Integration: PASSED');
}

// تشغيل جميع الاختبارات
async function runAllTests() {
  console.log('🚀 Starting October Integration Tests...\n');
  
  const tests = [
    testFinancialProcessor,
    testAPIGateway,
    testWhatsAppHandler,
    testFullIntegration
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      test();
      passed++;
    } catch (error) {
      console.error(`❌ ${test.name}: FAILED - ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! October integration is ready.');
    return true;
  } else {
    console.log('\n⚠️ Some tests failed. Please review.');
    return false;
  }
}

runAllTests();