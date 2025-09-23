#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
🔍 SIMPLE DASHBOARD SERVER v1.0
===============================================================================

خادم داش بورد بسيط ومستقل

المؤلف: GitHub Copilot & Nexus Security Team
التاريخ: 22 سبتمبر 2025
===============================================================================
"""

import http.server
import socketserver
import json
import os
from pathlib import Path
import platform
import subprocess
import threading
import time

PORT = 8080

class SimpleDashboardHandler(http.server.BaseHTTPRequestHandler):
    """معالج طلبات الداش بورد البسيط"""

    def do_GET(self):
        """معالجة طلبات GET"""
        try:
            if self.path == "/" or self.path == "/index.html":
                self.serve_dashboard()
            elif self.path.startswith("/static/"):
                self.serve_static_file()
            elif self.path.startswith("/api/"):
                self.handle_api_get()
            else:
                self.send_error(404)
        except Exception as e:
            self.send_error(500, str(e))

    def do_POST(self):
        """معالجة طلبات POST"""
        try:
            if self.path.startswith("/api/"):
                self.handle_api_post()
            else:
                self.send_error(404)
        except Exception as e:
            self.send_error(500, str(e))

    def serve_dashboard(self):
        """عرض صفحة الداش بورد الرئيسية"""
        html_content = self.generate_dashboard_html()
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(html_content.encode('utf-8'))

    def serve_static_file(self):
        """عرض الملفات الثابتة"""
        try:
            filename = self.path.split("/static/")[1]
            static_dir = Path(__file__).parent / "static"
            static_dir.mkdir(exist_ok=True)

            if filename == "dashboard.css":
                content = self.get_css_content()
                content_type = "text/css"
            elif filename == "dashboard.js":
                content = self.get_js_content()
                content_type = "application/javascript"
            else:
                self.send_error(404)
                return

            self.send_response(200)
            self.send_header('Content-type', content_type + '; charset=utf-8')
            self.end_headers()
            self.wfile.write(content.encode('utf-8'))

        except Exception as e:
            self.send_error(500, str(e))

    def handle_api_get(self):
        """معالجة طلبات API GET"""
        path_parts = self.path.strip("/").split("/")

        if len(path_parts) >= 2 and path_parts[0] == "api":
            if path_parts[1] == "system":
                if len(path_parts) > 2 and path_parts[2] == "info":
                    self.api_system_info()
                elif len(path_parts) > 2 and path_parts[2] == "resources":
                    self.api_system_resources()
            elif path_parts[1] == "logs" and len(path_parts) > 2 and path_parts[2] == "recent":
                self.api_recent_logs()
            elif path_parts[1] == "results" and len(path_parts) > 2:
                self.api_scan_results(path_parts[2])
        else:
            self.send_error(404)

    def handle_api_post(self):
        """معالجة طلبات API POST"""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                post_data = self.rfile.read(content_length)
                try:
                    data = json.loads(post_data.decode('utf-8'))
                except json.JSONDecodeError:
                    data = {}
            else:
                data = {}

            path_parts = self.path.strip("/").split("/")

            if len(path_parts) >= 2 and path_parts[0] == "api":
                if path_parts[1] == "scan":
                    if len(path_parts) > 2 and path_parts[2] == "start":
                        self.api_start_scan(data)
                    elif len(path_parts) > 2 and path_parts[2] == "stop":
                        self.api_stop_scan()
                elif path_parts[1] == "results" and len(path_parts) > 2 and path_parts[2] == "clear":
                    self.api_clear_results()
                elif path_parts[1] == "export":
                    self.api_export_report(data)
                elif path_parts[1] == "open-reports-dir":
                    self.api_open_reports_dir()
                else:
                    self.send_error(404)
            else:
                self.send_error(404)
        except Exception as e:
            self.send_error(500, f"خطأ في معالجة الطلب: {str(e)}")

    def api_system_info(self):
        """معلومات النظام"""
        info = {
            "platform": platform.system(),
            "deepseek_status": "غير متاح (خادم بسيط)",
            "total_scans": 0,
            "scanner_version": "1.0.0 - Simple"
        }
        self.send_json_response(info)

    def api_system_resources(self):
        """استخدام موارد النظام"""
        resources = {
            "cpu": 0,
            "memory": 0,
            "disk": 0,
            "gpu": []
        }
        self.send_json_response(resources)

    def api_recent_logs(self):
        """السجلات الأخيرة"""
        logs = ["خادم داش بورد بسيط جاهز للعمل", "لا توجد عمليات فحص سابقة"]
        self.send_json_response(logs)

    def api_scan_results(self, scan_id):
        """نتائج الفحص"""
        results = {
            "scan_id": scan_id,
            "findings": [],
            "summary": {"total_findings": 0, "severity_breakdown": {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}},
            "ai_insights": {"overall_risk_assessment": "UNKNOWN"},
            "performance_metrics": {}
        }
        self.send_json_response(results)

    def api_start_scan(self, data):
        """بدء الفحص"""
        response = {"success": False, "message": "الماسح غير متاح في النسخة البسيطة"}
        self.send_json_response(response)

    def api_stop_scan(self):
        """إيقاف الفحص"""
        response = {"success": True, "message": "لا توجد عمليات فحص جارية"}
        self.send_json_response(response)

    def api_clear_results(self):
        """مسح النتائج"""
        response = {"success": True, "message": "تم مسح النتائج"}
        self.send_json_response(response)

    def api_export_report(self, data):
        """تصدير التقرير"""
        response = {"success": False, "message": "تصدير التقارير غير متاح في النسخة البسيطة"}
        self.send_json_response(response)

    def api_open_reports_dir(self):
        """فتح مجلد التقارير"""
        try:
            reports_dir = Path("./reports")
            reports_dir.mkdir(exist_ok=True)

            if platform.system() == "Windows":
                os.startfile(str(reports_dir))
            elif platform.system() == "Darwin":  # macOS
                subprocess.run(["open", str(reports_dir)])
            else:  # Linux
                subprocess.run(["xdg-open", str(reports_dir)])
        except Exception as e:
            print(f"خطأ في فتح مجلد التقارير: {e}")

        response = {"success": True, "message": "تم فتح مجلد التقارير"}
        self.send_json_response(response)

    def send_json_response(self, data):
        """إرسال استجابة JSON"""
        self.send_response(200)
        self.send_header('Content-type', 'application/json; charset=utf-8')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

    def generate_dashboard_html(self):
        """توليد HTML للداش بورد"""
        html = f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔍 DeepSeek Ultimate Security Dashboard - Simple v1.0</title>
    <link rel="stylesheet" href="/static/dashboard.css">
</head>
<body>
    <div class="container">
        <!-- الهيدر -->
        <div class="header">
            <h1>🔒 DeepSeek Ultimate Security Scanner</h1>
            <p>لوحة التحكم البسيطة - نسخة 1.0</p>
            <div style="background: #fef3c7; color: #92400e; padding: 10px; border-radius: 8px; margin-top: 10px;">
                ⚠️ هذه نسخة بسيطة من الداش بورد. الماسح الأمني الكامل غير متاح حالياً.
            </div>
        </div>

        <!-- لوحة التحكم -->
        <div class="control-panel">
            <div class="control-card">
                <h3>🔍 بدء الفحص</h3>
                <button id="start-full-scan" class="btn" disabled>فحص شامل كامل</button>
                <button id="start-quick-scan" class="btn" disabled>فحص سريع</button>
                <button id="start-ai-scan" class="btn" disabled>فحص ذكي AI</button>
                <button id="stop-scan" class="btn btn-danger" disabled>إيقاف الفحص</button>
                <p style="color: #718096; font-size: 0.9em; margin-top: 10px;">الماسح غير متاح في النسخة البسيطة</p>
            </div>

            <div class="control-card">
                <h3>📊 حالة الفحص</h3>
                <div id="scan-status">الخادم جاهز</div>
                <div class="progress-bar">
                    <div id="scan-progress" class="progress-fill"></div>
                </div>
                <div id="scan-progress-text">0%</div>
            </div>

            <div class="control-card">
                <h3>🛠️ أدوات إضافية</h3>
                <button id="clear-results" class="btn">مسح النتائج</button>
                <button id="export-report" class="btn" disabled>تصدير التقرير</button>
                <button id="open-reports-dir" class="btn">فتح مجلد التقارير</button>
            </div>
        </div>

        <!-- لوحة الحالة -->
        <div id="system-info" class="status-panel">
            <!-- سيتم ملؤها بواسطة JavaScript -->
        </div>

        <!-- مراقبة الموارد -->
        <div class="resource-monitor">
            <h3>💻 مراقبة موارد النظام</h3>
            <div class="resource-grid">
                <div class="resource-item">
                    <div class="resource-label">CPU</div>
                    <div id="cpu-usage" class="resource-value">غير متاح</div>
                    <div class="resource-bar"><div id="cpu-bar" class="resource-fill"></div></div>
                </div>
                <div class="resource-item">
                    <div class="resource-label">الذاكرة</div>
                    <div id="memory-usage" class="resource-value">غير متاح</div>
                    <div class="resource-bar"><div id="memory-bar" class="resource-fill"></div></div>
                </div>
                <div class="resource-item">
                    <div class="resource-label">GPU</div>
                    <div id="gpu-usage" class="resource-value">غير متاح</div>
                    <div class="resource-bar"><div id="gpu-bar" class="resource-fill" style="width: 0%;"></div></div>
                    <div id="gpu-temp" class="resource-label">درجة الحرارة: --°C</div>
                </div>
            </div>
        </div>

        <!-- نتائج الفحص -->
        <div class="results-panel">
            <h3>📋 نتائج الفحص</h3>
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; text-align: center; color: #718096;">
                <h4>🔍 الماسح الأمني غير متاح</h4>
                <p>هذه نسخة بسيطة من لوحة التحكم. للحصول على الماسح الكامل:</p>
                <ul style="text-align: right; margin-top: 10px;">
                    <li>تأكد من تثبيت جميع المكتبات المطلوبة</li>
                    <li>تحقق من وجود ملف deepseek_ultimate_scanner.py</li>
                    <li>استخدم python run_dashboard.py للنسخة الكاملة</li>
                </ul>
            </div>
        </div>

        <!-- لوحة السجلات -->
        <div class="log-panel">
            <h3>📝 سجل العمليات</h3>
            <div id="log-content" class="log-content">خادم داش بورد بسيط جاهز للعمل\nلا توجد عمليات فحص سابقة</div>
        </div>
    </div>

    <script src="/static/dashboard.js"></script>
</body>
</html>"""
        return html

    def get_css_content(self):
        """الحصول على محتوى CSS"""
        return """
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .header h1 {
            color: #4a5568;
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .header p {
            color: #718096;
            font-size: 1.2em;
        }

        .control-panel {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .control-card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .control-card h3 {
            color: #4a5568;
            margin-bottom: 15px;
            font-size: 1.3em;
        }

        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1em;
            margin: 5px;
            transition: transform 0.2s;
        }

        .btn:hover:not(:disabled) {
            transform: translateY(-2px);
        }

        .btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .btn-danger {
            background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
        }

        .status-panel {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .status-card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .status-icon {
            font-size: 2em;
            margin-bottom: 10px;
        }

        .status-value {
            font-size: 1.8em;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .status-label {
            color: #718096;
            font-size: 0.9em;
        }

        .progress-bar {
            width: 100%;
            height: 20px;
            background: #e2e8f0;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            width: 0%;
            transition: width 0.3s ease;
        }

        .resource-monitor {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .resource-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }

        .resource-item {
            text-align: center;
        }

        .resource-label {
            color: #718096;
            font-size: 0.9em;
            margin-bottom: 5px;
        }

        .resource-value {
            font-size: 1.5em;
            font-weight: bold;
            color: #4a5568;
        }

        .resource-bar {
            width: 100%;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 5px;
        }

        .resource-fill {
            height: 100%;
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            width: 0%;
            transition: width 0.3s ease;
        }

        .results-panel {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .log-panel {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 25px;
            margin-top: 30px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .log-content {
            background: #2d3748;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            max-height: 300px;
            overflow-y: auto;
            white-space: pre-wrap;
        }

        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }

            .header h1 {
                font-size: 2em;
            }

            .control-panel, .status-panel {
                grid-template-columns: 1fr;
            }
        }
        """

    def get_js_content(self):
        """الحصول على محتوى JavaScript"""
        return """
        class SimpleDashboardApp {
            constructor() {
                this.initializeEventListeners();
                this.loadInitialData();
            }

            initializeEventListeners() {
                // أزرار التحكم
                document.getElementById('clear-results').addEventListener('click', () => this.clearResults());
                document.getElementById('open-reports-dir').addEventListener('click', () => this.openReportsDir());

                // تعطيل الأزرار غير المدعومة
                document.getElementById('start-full-scan').addEventListener('click', () => this.showNotAvailable());
                document.getElementById('start-quick-scan').addEventListener('click', () => this.showNotAvailable());
                document.getElementById('start-ai-scan').addEventListener('click', () => this.showNotAvailable());
                document.getElementById('export-report').addEventListener('click', () => this.showNotAvailable());
            }

            async loadInitialData() {
                try {
                    // تحميل بيانات النظام
                    const systemResponse = await fetch('/api/system/info');
                    const systemInfo = await systemResponse.json();

                    document.getElementById('system-info').innerHTML = `
                        <div class="status-card">
                            <div class="status-icon">🖥️</div>
                            <div class="status-value">${systemInfo.platform}</div>
                            <div class="status-label">نظام التشغيل</div>
                        </div>
                        <div class="status-card">
                            <div class="status-icon">🔍</div>
                            <div class="status-value">${systemInfo.deepseek_status}</div>
                            <div class="status-label">حالة DeepSeek</div>
                        </div>
                        <div class="status-card">
                            <div class="status-icon">📊</div>
                            <div class="status-value">${systemInfo.total_scans}</div>
                            <div class="status-label">إجمالي الفحوصات</div>
                        </div>
                    `;

                    // تحميل السجلات
                    this.loadRecentLogs();

                } catch (error) {
                    console.error('خطأ في تحميل البيانات الأولية:', error);
                }
            }

            async loadRecentLogs() {
                try {
                    const response = await fetch('/api/logs/recent');
                    const logs = await response.json();

                    const logContainer = document.getElementById('log-content');
                    logContainer.textContent = logs.join('\\n');
                    logContainer.scrollTop = logContainer.scrollHeight;
                } catch (error) {
                    console.error('خطأ في تحميل السجلات:', error);
                }
            }

            async clearResults() {
                if (confirm('هل أنت متأكد من مسح جميع النتائج؟')) {
                    try {
                        const response = await fetch('/api/results/clear', { method: 'POST' });
                        const result = await response.json();

                        if (result.success) {
                            this.showSuccess('تم مسح النتائج بنجاح');
                        }
                    } catch (error) {
                        console.error('خطأ في مسح النتائج:', error);
                    }
                }
            }

            async openReportsDir() {
                try {
                    await fetch('/api/open-reports-dir', { method: 'POST' });
                } catch (error) {
                    console.error('خطأ في فتح مجلد التقارير:', error);
                }
            }

            showNotAvailable() {
                alert('هذه الميزة غير متاحة في النسخة البسيطة من الداش بورد.\\n\\nللحصول على الماسح الكامل:\\n1. تأكد من تثبيت جميع المكتبات\\n2. استخدم python run_dashboard.py');
            }

            showError(message) {
                alert('خطأ: ' + message);
            }

            showSuccess(message) {
                alert('نجح: ' + message);
            }
        }

        // تهيئة التطبيق عند تحميل الصفحة
        document.addEventListener('DOMContentLoaded', () => {
            window.dashboardApp = new SimpleDashboardApp();
        });
        """

def main():
    """تشغيل الخادم البسيط"""
    print("🔍 Simple Dashboard Server v1.0")
    print("🚀 تشغيل الخادم على http://localhost:8080")
    print("=" * 50)

    try:
        with socketserver.TCPServer(("", PORT), SimpleDashboardHandler) as httpd:
            print(f"✅ الخادم جاهز على المنفذ {PORT}")
            print("📱 يمكنك الآن فتح http://localhost:8080 في المتصفح")
            print("🛑 اضغط Ctrl+C لإيقاف الخادم")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\\n🛑 تم إيقاف الخادم")
    except Exception as e:
        print(f"❌ خطأ في تشغيل الخادم: {e}")

if __name__ == "__main__":
    main()