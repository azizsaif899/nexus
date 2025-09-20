const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });

  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url.includes('/api/sheets/')) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      res.end(JSON.stringify({
        query: data.query,
        message: `تم استلام الاستفسار: "${data.query}". الخادم يعمل بنجاح!`,
        status: 'success'
      }));
    });
  } else {
    res.end(JSON.stringify({ message: 'AzizSys Server Running', port: 3001 }));
  }
});

const PORT = 3002;
server.listen(PORT, () => {
  // Removed console.log
  // Removed console.log
});

server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
});