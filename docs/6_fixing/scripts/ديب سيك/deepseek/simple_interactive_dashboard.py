#!/usr/bin/env python3
import http.server
import socketserver
import time
import subprocess
import json

PORT = 8080

class SimpleInteractiveHandler(http.server.BaseHTTPRequestHandler):
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
    <title>🔍 DeepSeek Security Dashboard - Interactive</title>
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
            max-width: 1000px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }}
        .script-btn {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 20px;
            border-radius: 8px;
            font-size: 1em;
            font-weight: bold;
            cursor: pointer;
            margin: 10px;
            transition: all 0.3s ease;
        }}
        .script-btn:hover {{
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }}
        .output-area {{
            background: #2d3748;
            color: #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            max-height: 400px;
            overflow-y: auto;
            margin-top: 20px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>🔒 DeepSeek Ultimate Security Scanner - Interactive</h1>
        <p>لوحة التحكم التفاعلية - اضغط على الأزرار لتشغيل السكريبتات</p>

        <div id="current-time">
            🕐 الوقت الحالي: {current_time}
        </div>

        <h3>🚀 تشغيل السكريبتات</h3>
        <button class="script-btn" onclick="runScript('test-system')">
            🧪 اختبار النظام
        </button>
        <button class="script-btn" onclick="runScript('deepseek-scanner')">
            🔍 الماسح الأمني
        </button>
        <button class="script-btn" onclick="runScript('project-test')">
            📊 اختبار المشروع
        </button>

        <div class="output-area" id="output-area">
🔄 جاهز لتشغيل السكريبتات...
        </div>
    </div>

        <script>
        function updateTime() {{
            const now = new Date();
            document.getElementById('current-time').innerHTML =
                '🕐 الوقت الحالي: ' + now.toLocaleString('ar-SA');
        }}

        setInterval(updateTime, 1000);

        async function runScript(scriptName) {{
            const outputArea = document.getElementById('output-area');
            outputArea.textContent += '\\n🚀 تشغيل: ' + scriptName + '\\n' + '='.repeat(50);

            try {{
                const response = await fetch('/api/run-script', {{
                    method: 'POST',
                    headers: {{
                        'Content-Type': 'application/json',
                    }},
                    body: JSON.stringify({{ script: scriptName }})
                }});

                const result = await response.json();

                if (result.success) {{
                    outputArea.textContent += '\\n✅ نجح: ' + result.output;
                }} else {{
                    outputArea.textContent += '\\n❌ فشل: ' + result.error;
                }}

            }} catch (error) {{
                outputArea.textContent += '\\n❌ خطأ: ' + error.message;
            }}

            outputArea.scrollTop = outputArea.scrollHeight;
        }}
    </script>
</body>
</html>"""
        self.wfile.write(html.encode('utf-8'))

    def do_POST(self):
        if self.path == '/api/run-script':
            self.handle_run_script()
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
        else:
            self.send_error(404)

    def handle_run_script(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                self.send_error(400, "No data")
                return

            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            script_name = data.get('script', '')

            result = self.run_script_command(script_name)

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
            'deepseek-scanner': ['python', 'deepseek_ultimate_scanner.py', '--help'],
            'project-test': ['node', 'PROJECT_TEST_SUITE.js']
        }

        if script_name not in commands:
            return {'success': False, 'error': f'Unknown script: {script_name}'}

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
                output += f"\\nError: {result.stderr}"

            return {
                'success': result.returncode == 0,
                'output': output[:1000],  # Limit output
                'returncode': result.returncode
            }

        except subprocess.TimeoutExpired:
            return {'success': False, 'error': 'Timeout'}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def log_message(self, format, *args):
        pass

if __name__ == "__main__":
    print("🔍 تشغيل خادم داش بورد Windows التفاعلي البسيط...")
    print(f"🌐 العنوان: http://localhost:{PORT}")
    print("✅ الخادم جاهز للعمل!")
    print("🛑 اضغط Ctrl+C للإيقاف")
    print("=" * 50)

    try:
        with socketserver.TCPServer(("", PORT), SimpleInteractiveHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\\n🛑 تم إيقاف الخادم")
    except Exception as e:
        print(f"❌ خطأ: {e}")