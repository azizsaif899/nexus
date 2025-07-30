// اختبار سريع للخدمة الهجينة
const http = require('http');

const testEndpoints = [
  { path: '/health', method: 'GET' },
  { path: '/api/generate', method: 'POST', data: { prompt: 'مرحبا' } }
];

function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 54112,
      path: endpoint.path,
      method: endpoint.method,
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`✅ ${endpoint.path}: ${res.statusCode} - ${data.substring(0, 100)}`);
        resolve(true);
      });
    });

    req.on('error', (e) => {
      console.log(`❌ ${endpoint.path}: ${e.message}`);
      resolve(false);
    });

    if (endpoint.data) {
      req.write(JSON.stringify(endpoint.data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 اختبار الخدمة الهجينة...\n');
  
  for (const endpoint of testEndpoints) {
    await testEndpoint(endpoint);
  }
  
  console.log('\n✅ انتهى الاختبار!');
}

runTests();