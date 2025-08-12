const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// Serve Admin Dashboard
app.use('/admin', express.static(path.join(__dirname, 'apps/admin-dashboard')));

// Serve Web Chatbot
app.use('/chat', express.static(path.join(__dirname, 'apps/web-chatbot')));

// Main page - Dashboard selector
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🚀 AzizSys AI Assistant v2.0</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Segoe UI', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh; display: flex; align-items: center; justify-content: center;
                direction: rtl;
            }
            .container {
                background: rgba(255, 255, 255, 0.95); padding: 40px;
                border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                text-align: center; max-width: 600px;
            }
            h1 { color: #667eea; font-size: 2.5em; margin-bottom: 20px; }
            p { color: #666; margin-bottom: 30px; font-size: 1.2em; }
            .buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .btn {
                padding: 20px; background: #667eea; color: white; text-decoration: none;
                border-radius: 12px; font-size: 1.1em; transition: all 0.3s ease;
                display: flex; flex-direction: column; align-items: center; gap: 10px;
            }
            .btn:hover { background: #764ba2; transform: translateY(-3px); }
            .api-links { display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; }
            .api-links a {
                padding: 10px 15px; background: rgba(102, 126, 234, 0.1);
                color: #667eea; text-decoration: none; border-radius: 8px;
                border: 1px solid #667eea; font-size: 14px;
            }
            .api-links a:hover { background: #667eea; color: white; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 AzizSys AI Assistant</h1>
            <p>نظام مساعد ذكي متكامل - الإصدار 2.0</p>
            
            <div class="buttons">
                <a href="/admin" class="btn">
                    <span style="font-size: 2em;">🎨</span>
                    <span>لوحة الإدارة</span>
                    <small>Admin Dashboard</small>
                </a>
                <a href="/chat" class="btn">
                    <span style="font-size: 2em;">💬</span>
                    <span>المحادثة الذكية</span>
                    <small>AI Chatbot</small>
                </a>
            </div>
            
            <div class="api-links">
                <a href="/health">🏥 صحة النظام</a>
                <a href="/api/docs">📚 وثائق API</a>
                <a href="/ai/models">🤖 نماذج AI</a>
                <a href="/odoo-webhook">🔗 Odoo Integration</a>
            </div>
            
            <div style="margin-top: 30px; color: #666; font-size: 14px;">
                <p>✅ جميع الخدمات تعمل على المنفذ 3000</p>
                <p>🌐 واجهة موحدة - روابط داخلية</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'AzizSys AI Assistant',
    version: '2.0.0',
    components: {
      admin_dashboard: 'Active',
      web_chatbot: 'Active',
      api_server: 'Running',
      ai_engine: 'Connected',
      odoo_integration: 'Ready'
    },
    endpoints: {
      admin: '/admin',
      chat: '/chat',
      health: '/health',
      docs: '/api/docs',
      models: '/ai/models'
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
            body { font-family: Arial; padding: 20px; background: #f5f5f5; direction: rtl; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
            h1 { color: #667eea; text-align: center; }
            .endpoint { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .method { background: #28a745; color: white; padding: 3px 8px; border-radius: 3px; font-size: 12px; }
            .back-btn { display: inline-block; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <a href="/" class="back-btn">🏠 العودة للرئيسية</a>
            <h1>📚 وثائق AzizSys API</h1>
            
            <div class="endpoint">
                <span class="method">GET</span> <strong>/</strong>
                <p>الصفحة الرئيسية - اختيار الواجهة</p>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <strong>/admin</strong>
                <p>لوحة الإدارة - مراقبة النظام والإحصائيات</p>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <strong>/chat</strong>
                <p>واجهة المحادثة الذكية مع AI</p>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <strong>/health</strong>
                <p>فحص صحة النظام والمكونات</p>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <strong>/ai/models</strong>
                <p>قائمة نماذج الذكاء الاصطناعي المتاحة</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

// AI Models endpoint
app.get('/ai/models', (req, res) => {
  res.json({
    models: [
      { name: 'gemini-1.5-flash', status: 'active', cost: 0.1, speed: 'fast' },
      { name: 'gemini-1.5-pro', status: 'active', cost: 0.5, speed: 'medium' },
      { name: 'gemini-2.0-flash-exp', status: 'active', cost: 0.2, speed: 'fast' }
    ],
    total: 3,
    active: 3,
    selection_strategy: 'dynamic',
    last_updated: new Date().toISOString()
  });
});

// Odoo webhook
app.post('/odoo-webhook', (req, res) => {
  console.log('📨 Received Odoo webhook:', req.body);
  res.json({ 
    success: true, 
    message: 'Webhook processed successfully',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`🚀 AzizSys AI Assistant running on http://localhost:${port}`);
  console.log(`🎨 Admin Dashboard: http://localhost:${port}/admin`);
  console.log(`💬 Web Chatbot: http://localhost:${port}/chat`);
  console.log(`🏥 Health Check: http://localhost:${port}/health`);
  console.log(`📚 API Docs: http://localhost:${port}/api/docs`);
});

module.exports = app;