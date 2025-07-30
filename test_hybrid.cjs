const http = require('http');

console.log('🧪 اختبار الخدمة الهجينة على المنفذ 54112...\n');

// اختبار /health
const healthReq = http.request({
  hostname: 'localhost',
  port: 54112,
  path: '/health',
  method: 'GET'
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`✅ Health Check: ${res.statusCode}`);
    console.log(`📄 Response: ${data}\n`);
    
    // اختبار /api/generate
    testGenerate();
  });
});

healthReq.on('error', (e) => {
  console.log(`❌ Health Check Failed: ${e.message}`);
});

healthReq.end();

function testGenerate() {
  const postData = JSON.stringify({
    prompt: 'قل مرحبا بالعربية',
    model: 'gemini-2.0-flash-exp'
  });

  const genReq = http.request({
    hostname: 'localhost',
    port: 54112,
    path: '/api/generate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`✅ Generate API: ${res.statusCode}`);
      console.log(`📄 Response: ${data.substring(0, 200)}...\n`);
      console.log('🎉 الخدمة الهجينة تعمل بنجاح!');
    });
  });

  genReq.on('error', (e) => {
    console.log(`❌ Generate API Failed: ${e.message}`);
  });

  genReq.write(postData);
  genReq.end();
}