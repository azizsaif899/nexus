// اختبار جميع APIs
const BASE_URL = 'http://localhost:9002';

async function testAPI(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();
    
    console.log(`✅ ${method} ${endpoint}:`, result);
    return result;
  } catch (error) {
    console.log(`❌ ${method} ${endpoint}:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('🧪 بدء اختبار APIs...\n');
  
  // اختبار Auth
  await testAPI('/api/auth');
  await testAPI('/api/auth', 'POST', { email: 'test@example.com', password: '123456' });
  
  // اختبار CRM
  await testAPI('/api/crm/leads');
  await testAPI('/api/crm/leads', 'POST', { name: 'عميل جديد', email: 'client@example.com' });
  
  // اختبار Chat
  await testAPI('/api/chat');
  await testAPI('/api/chat', 'POST', { message: 'مرحباً', userId: '1' });
  
  // اختبار Webhook
  await testAPI('/api/webhook');
  await testAPI('/api/webhook', 'POST', { source: 'whatsapp', data: { message: 'test' } });
  
  // اختبار Monitoring
  await testAPI('/api/monitoring');
  await testAPI('/api/monitoring', 'POST', { event: 'test', level: 'info', message: 'اختبار' });
  
  console.log('\n🎉 انتهى الاختبار!');
}

runTests();