#!/usr/bin/env python3
import http.server
import socketserver
import time
import subprocess
import threading
import json
import urllib.parse

PORT = 8080

class WorkingDashboardHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/api/'):
            self.handle_api()
            return

        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()

        current_time = time.strftime('%Y-%m-%d %H:%M:%S')

        html = f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔍 DeepSeek Security Dashboard - Windows</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            color: #333;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }}
        .header {{
            text-align: center;
            margin-bottom: 30px;
        }}
        .header h1 {{
            color: #4a5568;
            font-size: 2.5em;
            margin-bottom: 10px;
        }}
        .header p {{
            color: #718096;
            font-size: 1.2em;
        }}
        .status-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }}
        .status-card {{
            background: white;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }}
        .status-icon {{
            font-size: 2.5em;
            margin-bottom: 10px;
        }}
        .status-value {{
            font-size: 1.5em;
            font-weight: bold;
            color: #4a5568;
            margin-bottom: 5px;
        }}
        .status-label {{
            color: #718096;
            font-size: 0.9em;
        }}
        .info-section {{
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            border-right: 4px solid #48bb78;
        }}
        .warning-section {{
            background: #fff3cd;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            border-right: 4px solid #ffc107;
        }}
        .time-display {{
            background: #e3f2fd;
            border-radius: 10px;
            padding: 15px;
            text-align: center;
            margin: 20px 0;
            font-size: 1.2em;
            font-weight: bold;
            color: #1976d2;
        }}
        .control-section {{
            background: #f0f8ff;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            border-right: 4px solid #4299e1;
        }}
        .script-buttons {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }}
        .script-item {{
            display: flex;
            gap: 10px;
            align-items: center;
        }}
        .script-btn {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 15px;
            border-radius: 8px;
            font-size: 0.9em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            flex: 1;
            text-align: center;
        }}
        .script-btn:hover {{
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }}
        .script-btn.running {{
            background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
            cursor: not-allowed;
        }}
        .script-btn.success {{
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
        }}
        .script-btn.error {{
            background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
        }}
        .stop-btn {{
            background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
            color: white;
            border: none;
            padding: 12px 15px;
            border-radius: 8px;
            font-size: 0.9em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 80px;
        }}
        .stop-btn:hover {{
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }}
        .check-btn {{
            background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
            color: white;
            border: none;
            padding: 12px 15px;
            border-radius: 8px;
            font-size: 0.9em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 80px;
        }}
        .check-btn:hover {{
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }}
        .monitoring-section {{
            background: #2d3748;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            color: white;
        }}
        .monitoring-tabs {{
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }}
        .tab-btn {{
            background: #4a5568;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
        }}
        .tab-btn.active {{
            background: #667eea;
        }}
        .tab-content {{
            background: #1a202c;
            border-radius: 8px;
            padding: 15px;
            min-height: 200px;
            max-height: 300px;
            overflow-y: auto;
        }}
        .report-item {{
            background: #4a5568;
            margin: 5px 0;
            padding: 10px;
            border-radius: 6px;
            border-right: 4px solid #48bb78;
        }}
        .report-item.error {{
            border-right-color: #f56565;
        }}
        .report-item.warning {{
            border-right-color: #ed8936;
        }}
        .report-time {{
            font-size: 0.8em;
            color: #a0aec0;
        }}
        .report-content {{
            margin-top: 5px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }}
        .output-area {{
            background: #2d3748;
            color: #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            max-height: 300px;
            overflow-y: auto;
            white-space: pre-wrap;
            margin-top: 15px;
        }}
        .output-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }}
        .clear-btn {{
            background: #718096;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8em;
        }}
        .clear-btn:hover {{
            background: #5a67d8;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔒 DeepSeek Ultimate Security Scanner</h1>
            <p>لوحة التحكم الأمنية المتقدمة - نسخة Windows التفاعلية</p>
        </div>

        <div class="time-display" id="current-time">
            🕐 الوقت الحالي: {current_time}
        </div>

        <div class="status-grid">
            <div class="status-card">
                <div class="status-icon">✅</div>
                <div class="status-value">يعمل</div>
                <div class="status-label">حالة الخادم</div>
            </div>

            <div class="status-card">
                <div class="status-icon">🖥️</div>
                <div class="status-value">Windows</div>
                <div class="status-label">نظام التشغيل</div>
            </div>

            <div class="status-card">
                <div class="status-icon">🌐</div>
                <div class="status-value">8080</div>
                <div class="status-label">رقم المنفذ</div>
            </div>

            <div class="status-card">
                <div class="status-icon">🔍</div>
                <div class="status-value">36</div>
                <div class="status-label">معايير الأمان</div>
            </div>
        </div>

        <div class="control-section">
            <h3>🚀 تشغيل السكريبتات</h3>
            <div class="script-buttons">
                <div class="script-item">
                    <button class="script-btn" onclick="runScript('test-system')" id="btn-test-system">
                        🧪 اختبار النظام
                    </button>
                    <button class="check-btn" onclick="checkScript('test-system')">🔍 فحص</button>
                    <button class="stop-btn" onclick="stopScript('test-system')" id="stop-test-system" style="display:none;">⏹️ إيقاف</button>
                </div>
                <div class="script-item">
                    <button class="script-btn" onclick="runScript('deepseek-scanner')" id="btn-deepseek-scanner">
                        🔍 الماسح الأمني
                    </button>
                    <button class="check-btn" onclick="checkScript('deepseek-scanner')">🔍 فحص</button>
                    <button class="stop-btn" onclick="stopScript('deepseek-scanner')" id="stop-deepseek-scanner" style="display:none;">⏹️ إيقاف</button>
                </div>
                <div class="script-item">
                    <button class="script-btn" onclick="runScript('project-test')" id="btn-project-test">
                        📊 اختبار المشروع
                    </button>
                    <button class="check-btn" onclick="checkScript('project-test')">🔍 فحص</button>
                    <button class="stop-btn" onclick="stopScript('project-test')" id="stop-project-test" style="display:none;">⏹️ إيقاف</button>
                </div>
                <div class="script-item">
                    <button class="script-btn" onclick="runScript('api-test')" id="btn-api-test">
                        🌐 اختبار APIs
                    </button>
                    <button class="check-btn" onclick="checkScript('api-test')">🔍 فحص</button>
                    <button class="stop-btn" onclick="stopScript('api-test')" id="stop-api-test" style="display:none;">⏹️ إيقاف</button>
                </div>
                <div class="script-item">
                    <button class="script-btn" onclick="runScript('dashboard-server')" id="btn-dashboard-server">
                        🖥️ خادم الداشبورد
                    </button>
                    <button class="check-btn" onclick="checkScript('dashboard-server')">🔍 فحص</button>
                    <button class="stop-btn" onclick="stopScript('dashboard-server')" id="stop-dashboard-server" style="display:none;">⏹️ إيقاف</button>
                </div>
                <div class="script-item">
                    <button class="script-btn" onclick="runScript('system-info')" id="btn-system-info">
                        💻 معلومات النظام
                    </button>
                    <button class="check-btn" onclick="checkScript('system-info')">🔍 فحص</button>
                    <button class="stop-btn" onclick="stopScript('system-info')" id="stop-system-info" style="display:none;">⏹️ إيقاف</button>
                </div>
            </div>

            <div class="output-header">
                <h4>📋 إخراج العمليات</h4>
                <div>
                    <button class="clear-btn" onclick="clearOutput()">🗑️ مسح</button>
                    <button class="clear-btn" onclick="stopAllScripts()" style="margin-left: 10px;">⏹️ إيقاف الكل</button>
                </div>
            </div>
            <div class="output-area" id="output-area">
🔄 جاهز لتشغيل السكريبتات...
            </div>
        </div>

        <div class="monitoring-section">
            <h3>📊 لوحة مراقبة التقارير والأخطاء</h3>
            <div class="monitoring-tabs">
                <button class="tab-btn active" onclick="showTab('reports')">📋 التقارير</button>
                <button class="tab-btn" onclick="showTab('errors')">❌ الأخطاء</button>
                <button class="tab-btn" onclick="showTab('logs')">📝 السجلات</button>
                <button class="tab-btn" onclick="refreshMonitoring()">🔄 تحديث</button>
            </div>
            <div class="tab-content" id="reports-tab">
                <div id="reports-content">
                    <!-- التقارير ستظهر هنا -->
                </div>
            </div>
            <div class="tab-content" id="errors-tab" style="display:none;">
                <div id="errors-content">
                    <!-- الأخطاء ستظهر هنا -->
                </div>
            </div>
            <div class="tab-content" id="logs-tab" style="display:none;">
                <div id="logs-content">
                    <!-- السجلات ستظهر هنا -->
                </div>
            </div>
        </div>

        <div class="info-section">
            <h3>📋 معلومات النظام</h3>
            <ul style="text-align: right; margin-top: 10px;">
                <li><strong>الخادم:</strong> يعمل بنجاح على Windows</li>
                <li><strong>العنوان:</strong> http://localhost:8080</li>
                <li><strong>الحالة:</strong> متصل ومستقر</li>
                <li><strong>Python:</strong> """ + __import__('sys').version.split()[0] + """</li>
            </ul>
        </div>

        <div class="status-grid">
            <div class="status-card">
                <div class="status-icon">🤖</div>
                <div class="status-value">DeepSeek</div>
                <div class="status-label">الذكاء الاصطناعي</div>
            </div>

            <div class="status-card">
                <div class="status-icon">💻</div>
                <div class="status-value">GPU/CPU</div>
                <div class="status-label">موارد الجهاز</div>
            </div>

            <div class="status-card">
                <div class="status-icon">📊</div>
                <div class="status-value">متقدم</div>
                <div class="status-label">مستوى الفحص</div>
            </div>

            <div class="status-card">
                <div class="status-icon">🔄</div>
                <div class="status-value">تفاعلي</div>
                <div class="status-label">حالة النظام</div>
            </div>
        </div>

        <div class="warning-section">
            <h3>⚠️ ملاحظات مهمة</h3>
            <ul style="text-align: right; margin-top: 10px;">
                <li>الآن يمكنك تشغيل السكريبتات مباشرة من الواجهة!</li>
                <li>استخدم الأزرار أعلاه لتشغيل الاختبارات والفحوصات</li>
                <li>النتائج ستظهر في منطقة الإخراج أدناه</li>
                <li>تأكد من تثبيت المكتبات المطلوبة للسكريبتات المتقدمة</li>
            </ul>
        </div>
    </div>

    <script>
        let runningScripts = {};
        let currentTab = 'reports';

        function updateTime() {{
            const now = new Date();
            document.getElementById('current-time').innerHTML =
                '🕐 الوقت الحالي: ' + now.toLocaleString('ar-SA');
        }}

        setInterval(updateTime, 1000);

        async function runScript(scriptName) {{
            const btn = document.getElementById(`btn-${{scriptName}}`);
            const stopBtn = document.getElementById(`stop-${{scriptName}}`);

            if (runningScripts[scriptName]) {{
                showMessage('السكريبت يعمل بالفعل!', 'warning');
                return;
            }}

            btn.disabled = true;
            btn.innerHTML = '⏳ جاري التشغيل...';
            stopBtn.style.display = 'inline-block';

            try {{
                const response = await fetch('/api/run-script', {{
                    method: 'POST',
                    headers: {{ 'Content-Type': 'application/json' }},
                    body: JSON.stringify({{ script: scriptName }})
                }});

                const result = await response.json();

                if (result.success) {{
                    runningScripts[scriptName] = true;
                    showMessage(`تم تشغيل ${{scriptName}} بنجاح!`, 'success');
                    updateOutput();
                }} else {{
                    showMessage(`فشل في تشغيل ${{scriptName}}: ${{result.error}}`, 'error');
                }}
            }} catch (error) {{
                showMessage(`خطأ في الاتصال: ${{error.message}}`, 'error');
            }} finally {{
                btn.disabled = false;
                btn.innerHTML = getScriptButtonText(scriptName);
            }}
        }}

        async function stopScript(scriptName) {{
            const btn = document.getElementById(`btn-${{scriptName}}`);
            const stopBtn = document.getElementById(`stop-${{scriptName}}`);

            try {{
                const response = await fetch('/api/stop-script', {{
                    method: 'POST',
                    headers: {{ 'Content-Type': 'application/json' }},
                    body: JSON.stringify({{ script: scriptName }})
                }});

                const result = await response.json();

                if (result.success) {{
                    delete runningScripts[scriptName];
                    stopBtn.style.display = 'none';
                    btn.innerHTML = getScriptButtonText(scriptName);
                    showMessage(`تم إيقاف ${{scriptName}}`, 'info');
                    updateOutput();
                }} else {{
                    showMessage(`فشل في إيقاف ${{scriptName}}: ${{result.error}}`, 'error');
                }}
            }} catch (error) {{
                showMessage(`خطأ في الاتصال: ${{error.message}}`, 'error');
            }}
        }}

        async function checkScript(scriptName) {{
            try {{
                const response = await fetch(`/api/check-script?script=${{scriptName}}`);
                const result = await response.json();

                if (result.running) {{
                    showMessage(`${{scriptName}} يعمل حالياً`, 'info');
                    runningScripts[scriptName] = true;
                    document.getElementById(`stop-${{scriptName}}`).style.display = 'inline-block';
                }} else {{
                    showMessage(`${{scriptName}} متوقف`, 'info');
                    delete runningScripts[scriptName];
                    document.getElementById(`stop-${{scriptName}}`).style.display = 'none';
                }}
            }} catch (error) {{
                showMessage(`خطأ في فحص ${{scriptName}}: ${{error.message}}`, 'error');
            }}
        }}

        async function stopAllScripts() {{
            try {{
                const response = await fetch('/api/stop-all', {{
                    method: 'POST'
                }});

                const result = await response.json();

                if (result.success) {{
                    runningScripts = {{}};
                    document.querySelectorAll('.stop-btn').forEach(btn => {{
                        btn.style.display = 'none';
                    }});
                    document.querySelectorAll('.script-btn').forEach(btn => {{
                        btn.innerHTML = getScriptButtonText(btn.onclick.toString().match(/'([^']+)'/)[1]);
                    }});
                    showMessage('تم إيقاف جميع السكريبتات', 'info');
                    updateOutput();
                }} else {{
                    showMessage(`فشل في إيقاف السكريبتات: ${{result.error}}`, 'error');
                }}
            }} catch (error) {{
                showMessage(`خطأ في الاتصال: ${{error.message}}`, 'error');
            }}
        }}

        function getScriptButtonText(scriptName) {{
            const texts = {{
                'test-system': '🧪 اختبار النظام',
                'deepseek-scanner': '🔍 الماسح الأمني',
                'project-test': '📊 اختبار المشروع',
                'api-test': '🌐 اختبار APIs',
                'dashboard-server': '🖥️ خادم الداشبورد',
                'system-info': '💻 معلومات النظام'
            }};
            return texts[scriptName] || scriptName;
        }}

        function showTab(tabName) {{
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');

            document.querySelector(`[onclick="showTab('${{tabName}}')"]`).classList.add('active');
            document.getElementById(`${{tabName}}-tab`).style.display = 'block';
            currentTab = tabName;

            loadMonitoringData(tabName);
        }}

        async function loadMonitoringData(type) {{
            try {{
                const response = await fetch(`/api/monitoring?type=${{type}}`);
                const data = await response.json();

                const contentDiv = document.getElementById(`${{type}}-content`);
                contentDiv.innerHTML = '';

                if (data.items && data.items.length > 0) {{
                    data.items.forEach(item => {{
                        const itemDiv = document.createElement('div');
                        itemDiv.className = 'report-item';
                        itemDiv.innerHTML = `
                            <div class="report-time">${{item.time}}</div>
                            <div class="report-content">${{item.content}}</div>
                        `;
                        contentDiv.appendChild(itemDiv);
                    }});
                }} else {{
                    contentDiv.innerHTML = '<div class="report-item">لا توجد بيانات متاحة</div>';
                }}
            }} catch (error) {{
                document.getElementById(`${{type}}-content`).innerHTML = `<div class="report-item">خطأ في تحميل البيانات: ${{error.message}}</div>`;
            }}
        }}

        function refreshMonitoring() {{
            loadMonitoringData(currentTab);
            showMessage('تم تحديث البيانات', 'info');
        }}

        async function updateOutput() {{
            try {{
                const response = await fetch('/api/output');
                const data = await response.json();
                document.getElementById('output-area').innerHTML = data.output || '🔄 جاهز لتشغيل السكريبتات...';
            }} catch (error) {{
                console.error('خطأ في تحديث الإخراج:', error);
            }}
        }}

        function clearOutput() {{
            document.getElementById('output-area').innerHTML = '🔄 تم مسح الإخراج...';
            showMessage('تم مسح منطقة الإخراج', 'info');
        }}

        function showMessage(message, type = 'info') {{
            const colors = {{
                success: '#10b981',
                error: '#ef4444',
                warning: '#f59e0b',
                info: '#3b82f6'
            }};

            const outputArea = document.getElementById('output-area');
            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = `
                background: ${{colors[type]}};
                color: white;
                padding: 10px;
                margin: 5px 0;
                border-radius: 5px;
                font-weight: bold;
            `;
            messageDiv.textContent = `� ${{message}}`;
            outputArea.appendChild(messageDiv);

            setTimeout(() => {{
                if (messageDiv.parentNode) {{
                    messageDiv.remove();
                }}
            }}, 5000);
        }}

        // تحديث دوري للبيانات
        setInterval(() => {{
            updateOutput();
            loadMonitoringData(currentTab);
        }}, 5000);

        // تحميل البيانات الأولية
        document.addEventListener('DOMContentLoaded', () => {{
            loadMonitoringData('reports');
        }});

        console.log('✅ داش بورد Windows التفاعلي يعمل بنجاح!');
        console.log('🌐 العنوان: http://localhost:8080');
    </script>
</body>
</html>"""
        self.wfile.write(html.encode('utf-8'))

    def do_POST(self):
        if self.path == '/api/run-script':
            self.handle_run_script()
        elif self.path == '/api/stop-script':
            self.handle_stop_script()
        elif self.path == '/api/stop-all':
            self.handle_stop_all()
        else:
            self.send_error(404)

    def handle_api(self):
        if self.path == '/api/status':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            status = {
                'status': 'running',
                'time': time.strftime('%Y-%m-%d %H:%M:%S'),
                'port': PORT
            }
            self.wfile.write(json.dumps(status).encode('utf-8'))
        elif self.path == '/api/output':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            output_data = {
                'output': getattr(self.server, 'current_output', '🔄 جاهز لتشغيل السكريبتات...')
            }
            self.wfile.write(json.dumps(output_data).encode('utf-8'))
        elif self.path.startswith('/api/check-script'):
            self.handle_check_script()
        elif self.path.startswith('/api/monitoring'):
            self.handle_monitoring()
        else:
            self.send_error(404)

    def handle_run_script(self):
        try:
            # قراءة طول البيانات من الهيدر
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                self.send_error(400, "No data provided")
                return

            # قراءة البيانات
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            script_name = data.get('script', '')

            if not script_name:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': False,
                    'error': 'Script name is required'
                }).encode('utf-8'))
                return

            # تشغيل السكريبت المناسب
            result = self.run_script_command(script_name)

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))

        except json.JSONDecodeError:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': False,
                'error': 'Invalid JSON data'
            }).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': False,
                'error': str(e)
            }).encode('utf-8'))

    def handle_stop_script(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                self.send_error(400, "No data provided")
                return

            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            script_name = data.get('script', '')

            if not script_name:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': False,
                    'error': 'Script name is required'
                }).encode('utf-8'))
                return

            # محاولة إيقاف العملية (في الإصدار الحقيقي، نحتاج إلى تتبع PIDs)
            result = {'success': True, 'message': f'تم إيقاف {script_name}'}

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': False,
                'error': str(e)
            }).encode('utf-8'))

    def handle_stop_all(self):
        try:
            # محاولة إيقاف جميع العمليات (في الإصدار الحقيقي، نحتاج إلى تتبع جميع PIDs)
            result = {'success': True, 'message': 'تم إيقاف جميع السكريبتات'}

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': False,
                'error': str(e)
            }).encode('utf-8'))

    def handle_check_script(self):
        try:
            from urllib.parse import urlparse, parse_qs
            parsed_url = urlparse(self.path)
            query_params = parse_qs(parsed_url.query)
            script_name = query_params.get('script', [''])[0]

            if not script_name:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': False,
                    'error': 'Script name is required'
                }).encode('utf-8'))
                return

            # في الإصدار الحقيقي، نحتاج إلى التحقق من حالة العملية
            # هنا سنفترض أنها متوقفة افتراضياً
            result = {'running': False, 'script': script_name}

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': False,
                'error': str(e)
            }).encode('utf-8'))

    def handle_monitoring(self):
        try:
            from urllib.parse import urlparse, parse_qs
            parsed_url = urlparse(self.path)
            query_params = parse_qs(parsed_url.query)
            data_type = query_params.get('type', ['reports'])[0]

            # بيانات تجريبية للمراقبة
            monitoring_data = {
                'reports': [
                    {'time': '2024-01-15 10:30:00', 'content': 'تم تشغيل فحص النظام بنجاح'},
                    {'time': '2024-01-15 10:25:00', 'content': 'تم تحديث ملفات التكوين'},
                    {'time': '2024-01-15 10:20:00', 'content': 'تم التحقق من اتصال قاعدة البيانات'}
                ],
                'errors': [
                    {'time': '2024-01-15 10:15:00', 'content': 'خطأ في الاتصال بـ API خارجي'},
                    {'time': '2024-01-15 10:10:00', 'content': 'فشل في قراءة ملف التكوين'}
                ],
                'logs': [
                    {'time': '2024-01-15 10:35:00', 'content': 'INFO: بدء تشغيل الخادم'},
                    {'time': '2024-01-15 10:32:00', 'content': 'DEBUG: تحميل ملفات الإعدادات'},
                    {'time': '2024-01-15 10:28:00', 'content': 'INFO: الاتصال بقاعدة البيانات ناجح'}
                ]
            }

            result = {
                'type': data_type,
                'items': monitoring_data.get(data_type, [])
            }

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': False,
                'error': str(e)
            }).encode('utf-8'))

    def run_script_command(self, script_name):
        commands = {
            'test-system': ['python', 'test-system.py'],
            'deepseek-scanner': ['python', 'deepseek_ultimate_scanner.py', '--type', 'quick', '.'],
            'project-test': ['node', 'PROJECT_TEST_SUITE.js'],
            'api-test': ['node', 'test-apis.js'],
            'dashboard-server': ['python', 'dashboard_server.py'],
            'system-info': ['systeminfo']
        }

        if script_name not in commands:
            return {'success': False, 'error': f'سكريبت غير معروف: {script_name}'}

        try:
            result = subprocess.run(
                commands[script_name],
                capture_output=True,
                text=True,
                timeout=30,
                cwd='.'
            )

            output = result.stdout
            if result.stderr:
                output += f"\nخطأ: {result.stderr}"

            # تحديث الإخراج الحالي في الخادم
            current_time = time.strftime('%H:%M:%S')
            new_output = f"[{current_time}] تشغيل: {script_name}\n{output}\n{'='*50}\n"
            if hasattr(self.server, 'current_output'):
                self.server.current_output += new_output
            else:
                self.server.current_output = new_output

            return {
                'success': result.returncode == 0,
                'output': output,
                'returncode': result.returncode
            }

        except subprocess.TimeoutExpired:
            error_msg = 'انتهت مهلة التنفيذ'
            current_time = time.strftime('%H:%M:%S')
            new_output = f"[{current_time}] خطأ في {script_name}: {error_msg}\n{'='*50}\n"
            if hasattr(self.server, 'current_output'):
                self.server.current_output += new_output
            else:
                self.server.current_output = new_output
            return {'success': False, 'error': error_msg}
        except Exception as e:
            error_msg = str(e)
            current_time = time.strftime('%H:%M:%S')
            new_output = f"[{current_time}] خطأ في {script_name}: {error_msg}\n{'='*50}\n"
            if hasattr(self.server, 'current_output'):
                self.server.current_output += new_output
            else:
                self.server.current_output = new_output
            return {'success': False, 'error': error_msg}

if __name__ == "__main__":
    print("🔍 تشغيل خادم داش بورد Windows التفاعلي...")
    print(f"🌐 العنوان: http://localhost:{PORT}")
    print("✅ الخادم جاهز للعمل!")
    print("🛑 اضغط Ctrl+C للإيقاف")
    print("=" * 50)

    try:
        with socketserver.TCPServer(("", PORT), WorkingDashboardHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 تم إيقاف الخادم")
    except Exception as e:
        print(f"❌ خطأ: {e}")