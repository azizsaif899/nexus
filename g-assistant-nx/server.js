const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (pathname === '/') {
    res.writeHead(200);
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>🤖 AzizSys AI Assistant</title>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial; margin: 40px; background: #f5f5f5; }
          .container { background: white; padding: 30px; border-radius: 10px; }
          h1 { color: #333; }
          ul { list-style: none; padding: 0; }
          li { margin: 10px 0; }
          a { color: #007bff; text-decoration: none; padding: 10px; display: block; border: 1px solid #ddd; border-radius: 5px; }
          a:hover { background: #f8f9fa; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🤖 AzizSys AI Assistant</h1>
          <ul>
            <li><a href="/dashboard">📊 لوحة التحكم</a></li>
            <li><a href="/health">🔍 صحة النظام</a></li>
            <li><a href="/orchestrator">🎯 Enhanced Orchestrator</a></li>
          </ul>
        </div>
      </body>
      </html>
    `);
  } else if (pathname === '/dashboard') {
    const dashboardPath = path.join(__dirname, 'docs/6_fixing/reports/central_dashboard.json');
    
    let dashboardData = { status: 'No data available', timestamp: new Date().toISOString() };
    if (fs.existsSync(dashboardPath)) {
      try {
        dashboardData = JSON.parse(fs.readFileSync(dashboardPath, 'utf-8'));
      } catch (e) {
        dashboardData = { error: 'Failed to parse dashboard data', timestamp: new Date().toISOString() };
      }
    }
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.writeHead(200);
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>📊 لوحة التحكم - AzizSys AI</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
          }
          .header h1 {
            color: #333;
            font-size: 2.5em;
            margin-bottom: 10px;
          }
          .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 0.9em;
          }
          .healthy { background: #d4edda; color: #155724; }
          .warning { background: #fff3cd; color: #856404; }
          .error { background: #f8d7da; color: #721c24; }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
          }
          .stat-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            border-left: 5px solid #667eea;
            transition: transform 0.3s ease;
          }
          .stat-card:hover {
            transform: translateY(-5px);
          }
          .stat-card h3 {
            color: #667eea;
            font-size: 1.1em;
            margin-bottom: 10px;
          }
          .stat-value {
            font-size: 2.5em;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
          }
          .tasks-section {
            margin-top: 40px;
          }
          .tasks-section h2 {
            color: #333;
            margin-bottom: 20px;
            font-size: 1.8em;
          }
          .task-item {
            background: white;
            padding: 20px;
            margin: 10px 0;
            border-radius: 10px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.05);
            border-left: 4px solid #28a745;
          }
          .task-item.high { border-left-color: #dc3545; }
          .task-item.medium { border-left-color: #ffc107; }
          .task-item.low { border-left-color: #17a2b8; }
          .task-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          .task-id {
            font-weight: bold;
            color: #667eea;
          }
          .priority {
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 0.8em;
            font-weight: bold;
            text-transform: uppercase;
          }
          .priority.high { background: #f8d7da; color: #721c24; }
          .priority.medium { background: #fff3cd; color: #856404; }
          .priority.low { background: #d1ecf1; color: #0c5460; }
          .refresh-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #667eea;
            color: white;
            border: none;
            padding: 15px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2em;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
          }
          .refresh-btn:hover {
            background: #5a6fd8;
            transform: scale(1.1);
          }
          .last-update {
            text-align: center;
            color: #666;
            font-size: 0.9em;
            margin-top: 20px;
          }
          .back-link {
            display: inline-block;
            margin-bottom: 20px;
            color: #667eea;
            text-decoration: none;
            font-weight: bold;
          }
          .back-link:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <a href="/" class="back-link">← العودة للرئيسية</a>
          
          <div class="header">
            <h1>📊 لوحة التحكم الذكية</h1>
            <div class="status-badge ${dashboardData.status === 'healthy' ? 'healthy' : dashboardData.status === 'warning' ? 'warning' : 'error'}">
              ${dashboardData.status || 'غير محدد'}
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <h3>📋 إجمالي المهام</h3>
              <div class="stat-value">${dashboardData.totalTasks || 0}</div>
            </div>
            <div class="stat-card">
              <h3>✅ المهام المكتملة</h3>
              <div class="stat-value">${dashboardData.completedTasks || 0}</div>
            </div>
            <div class="stat-card">
              <h3>🎯 نقاط الصحة</h3>
              <div class="stat-value">${dashboardData.healthScore || 0}%</div>
            </div>
            <div class="stat-card">
              <h3>⏱️ وقت التنفيذ</h3>
              <div class="stat-value">${dashboardData.executionSummary?.totalExecutionTime || 'غير محدد'}</div>
            </div>
          </div>

          ${dashboardData.executionSummary ? `
          <div class="stats-grid">
            <div class="stat-card">
              <h3>🔴 أولوية عالية</h3>
              <div class="stat-value">${dashboardData.executionSummary.highPriorityTasks || 0}</div>
            </div>
            <div class="stat-card">
              <h3>🟡 أولوية متوسطة</h3>
              <div class="stat-value">${dashboardData.executionSummary.mediumPriorityTasks || 0}</div>
            </div>
            <div class="stat-card">
              <h3>🟢 أولوية منخفضة</h3>
              <div class="stat-value">${dashboardData.executionSummary.lowPriorityTasks || 0}</div>
            </div>
            <div class="stat-card">
              <h3>💾 النسخ الاحتياطية</h3>
              <div class="stat-value">${dashboardData.executionSummary.backupsCreated || 0}</div>
            </div>
          </div>
          ` : ''}

          ${dashboardData.taskDetails && dashboardData.taskDetails.length > 0 ? `
          <div class="tasks-section">
            <h2>📝 تفاصيل المهام</h2>
            ${dashboardData.taskDetails.map(task => `
              <div class="task-item ${task.priority?.toLowerCase() || 'low'}">
                <div class="task-header">
                  <span class="task-id">${task.id || 'غير محدد'}</span>
                  <span class="priority ${task.priority?.toLowerCase() || 'low'}">${task.priority || 'غير محدد'}</span>
                </div>
                <div><strong>الملف:</strong> ${task.file || 'غير محدد'}</div>
                <div><strong>الوصف:</strong> ${task.description || 'غير محدد'}</div>
                <div><strong>وقت التنفيذ:</strong> ${task.executionTime || 'غير محدد'}</div>
                <div><strong>الحالة:</strong> <span style="color: #28a745; font-weight: bold;">${task.status || 'غير محدد'}</span></div>
              </div>
            `).join('')}
          </div>
          ` : ''}

          <div class="last-update">
            آخر تحديث: ${dashboardData.lastUpdate ? new Date(dashboardData.lastUpdate).toLocaleString('ar-SA') : 'غير محدد'}
          </div>
        </div>

        <button class="refresh-btn" onclick="location.reload()" title="تحديث">
          🔄
        </button>

        <script>
          // تحديث تلقائي كل 30 ثانية
          setInterval(() => {
            location.reload();
          }, 30000);
        </script>
      </body>
      </html>
    `);
  } else if (pathname === '/health') {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      server: 'running',
      port: PORT
    }));
  } else if (pathname === '/orchestrator') {
    res.writeHead(200);
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>🎯 Enhanced Orchestrator</title>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial; margin: 20px; background: #f5f5f5; }
          .container { background: white; padding: 20px; border-radius: 10px; }
          .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
          .healthy { background: #d4edda; color: #155724; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎯 Enhanced Orchestrator Status</h1>
          <div class="status healthy">
            ✅ النظام جاهز للعمل
          </div>
          <p>📁 الملف: enhanced-orchestrator.ts</p>
          <p>🔧 الحالة: مكتمل</p>
          <p>⚡ الميزات: EventBus, Safety Checks, Auto-Fix</p>
          <a href="/">← العودة للرئيسية</a>
        </div>
      </body>
      </html>
    `);
  } else {
    res.writeHead(404);
    res.end('404 - الصفحة غير موجودة');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`);
  console.log('📊 لوحة التحكم: http://localhost:3000/dashboard');
  console.log('🎯 Enhanced Orchestrator: http://localhost:3000/orchestrator');
});