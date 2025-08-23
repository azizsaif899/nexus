const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 4200;

// Serve static files
app.use(express.static(path.join(__dirname, 'apps/admin-dashboard/src')));

// API endpoints for automation control
app.get('/api/automation/status', (req, res) => {
  res.json({ 
    status: 'running', 
    tasks: [
      { id: 1, name: 'System Check', status: 'completed' },
      { id: 2, name: 'Code Review', status: 'in-progress' }
    ]
  });
});

app.post('/api/automation/start', (req, res) => {
  res.json({ success: true, message: 'System started' });
});

app.post('/api/automation/stop', (req, res) => {
  res.json({ success: true, message: 'System stopped' });
});

// Serve main dashboard
app.get('*', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>AzizSys Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .status { padding: 10px; margin: 10px 0; border-radius: 4px; }
        .running { background: #d4edda; color: #155724; }
        .stopped { background: #f8d7da; color: #721c24; }
        button { padding: 10px 20px; margin: 5px; border: none; border-radius: 4px; cursor: pointer; }
        .start { background: #28a745; color: white; }
        .stop { background: #dc3545; color: white; }
        .card { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎛️ AzizSys Automation Dashboard</h1>
        
        <div class="status running">
            <h3>✅ System Status: Running</h3>
            <p>Last updated: ${new Date().toLocaleString()}</p>
        </div>

        <div class="card">
            <h3>🎯 System Control</h3>
            <button class="start" onclick="startSystem()">▶️ Start System</button>
            <button class="stop" onclick="stopSystem()">⏹️ Stop System</button>
        </div>

        <div class="card">
            <h3>📋 Current Tasks</h3>
            <ul>
                <li>✅ System Health Check - Completed</li>
                <li>🔄 Code Review Process - In Progress</li>
                <li>⏳ Documentation Update - Pending</li>
            </ul>
        </div>

        <div class="card">
            <h3>📊 Quick Stats</h3>
            <p>Tasks Completed Today: 15</p>
            <p>System Uptime: 2h 30m</p>
            <p>Last Error: None</p>
        </div>

        <div class="card">
            <h3>🔗 Quick Links</h3>
            <p><a href="/automation">Automation Control</a></p>
            <p><a href="/reports">Reports Viewer</a></p>
            <p><a href="/monitoring">System Monitoring</a></p>
        </div>
    </div>

    <script>
        function startSystem() {
            fetch('/api/automation/start', { method: 'POST' })
                .then(r => r.json())
                .then(data => alert(data.message));
        }
        
        function stopSystem() {
            fetch('/api/automation/stop', { method: 'POST' })
                .then(r => r.json())
                .then(data => alert(data.message));
        }
    </script>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 AzizSys Dashboard running at http://localhost:${PORT}`);
  console.log('📊 Dashboard is ready for monitoring!');
});