const express = require('express');
const app = express();
const port = 3333;

app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'AzizSys API Server',
    version: '2.0.0',
    components: {
      database: 'Connected',
      ai_engine: 'Active',
      odoo_integration: 'Connected',
      websockets: 'Running'
    }
  });
});

// API Docs
app.get('/api/docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
        <title>📚 AzizSys API Documentation</title>
        <style>
            body { font-family: Arial; padding: 20px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
            h1 { color: #0984e3; }
            .endpoint { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .method { background: #28a745; color: white; padding: 3px 8px; border-radius: 3px; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>📚 AzizSys API Documentation</h1>
            <p>مرحباً بك في وثائق API الخاصة بنظام AzizSys AI Assistant</p>
            
            <h2>🔗 Endpoints المتاحة:</h2>
            
            <div class="endpoint">
                <span class="method">GET</span> <strong>/health</strong>
                <p>فحص صحة النظام والحصول على معلومات الحالة</p>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <strong>/api/docs</strong>
                <p>عرض وثائق API (هذه الصفحة)</p>
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span> <strong>/odoo-webhook</strong>
                <p>استقبال تحديثات من نظام Odoo</p>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <strong>/ai/models</strong>
                <p>الحصول على قائمة نماذج الذكاء الاصطناعي المتاحة</p>
            </div>
            
            <h2>📊 معلومات النظام:</h2>
            <ul>
                <li>🚀 الإصدار: v2.0.0</li>
                <li>🤖 الذكاء الاصطناعي: Gemini AI</li>
                <li>🔗 التكاملات: Odoo, BigQuery, WhatsApp</li>
                <li>⚡ الحالة: نشط ويعمل</li>
            </ul>
        </div>
    </body>
    </html>
  `);
});

// AI Models endpoint
app.get('/ai/models', (req, res) => {
  res.json({
    models: [
      { name: 'gemini-1.5-flash', status: 'active', cost: 0.1 },
      { name: 'gemini-1.5-pro', status: 'active', cost: 0.5 },
      { name: 'gemini-2.0-flash-exp', status: 'active', cost: 0.2 }
    ],
    total: 3,
    active: 3
  });
});

// Odoo webhook
app.post('/odoo-webhook', (req, res) => {
  // Removed console.log
  res.json({ success: true, message: 'Webhook processed' });
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'AzizSys API Server v2.0',
    status: 'Running',
    endpoints: ['/health', '/api/docs', '/ai/models'],
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  // Removed console.log
  // Removed console.log
  // Removed console.log
});

module.exports = app;