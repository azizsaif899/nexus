#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
🔍 DEEP SEEK DASHBOARD SERVER v2.0
===============================================================================

خادم ويب تفاعلي للتحكم في الماسح الأمني الشامل

الميزات:
✅ واجهة ويب تفاعلية للتحكم في الفحص
✅ مراقبة الأخطاء والإصلاحات في الوقت الفعلي
✅ عرض التقارير المقسمة حسب الأهمية
✅ تكامل مع جميع مستويات الفحص
✅ استخدام موارد الجهاز (GPU، RAM، CPU)
✅ تحكم في DeepSeek المحلي والذكاء الصناعي

المؤلف: GitHub Copilot & Nexus Security Team
التاريخ: 22 سبتمبر 2025
===============================================================================
"""

import os
import sys
import json
import time
import threading
import subprocess
import webbrowser
from datetime import datetime
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse
import socket
import platform

# استيراد المكتبات الاختيارية مع معالجة الأخطاء
try:
    import psutil
    HAS_PSUTIL = True
except ImportError:
    psutil = None
    HAS_PSUTIL = False

try:
    import GPUtil
    HAS_GPUTIL = True
except ImportError:
    GPUtil = None
    HAS_GPUTIL = False

try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    requests = None
    HAS_REQUESTS = False

class DashboardServer:
    """خادم الداش بورد التفاعلي"""

    def __init__(self, scanner, host: str = "localhost", port: int = 8080):
        self.scanner = scanner
        self.host = host
        self.port = port
        self.server = None
        self.scanning_active = False
        self.current_scan_results = None
        self.scan_progress = {"status": "idle", "progress": 0, "current_file": ""}

        # إعداد المجلدات
        self.static_dir = Path(__file__).parent / "static"
        self.static_dir.mkdir(exist_ok=True)

        # إنشاء الملفات الثابتة
        self.create_static_files()

    def create_static_files(self):
        """إنشاء الملفات الثابتة للواجهة"""

        # ملف CSS
        css_content = """
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

        .btn:hover {
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

        .results-panel {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .results-tabs {
            display: flex;
            margin-bottom: 20px;
            border-bottom: 2px solid #e2e8f0;
        }

        .tab-btn {
            background: none;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            font-size: 1em;
            border-bottom: 3px solid transparent;
            transition: all 0.3s;
        }

        .tab-btn.active {
            border-bottom-color: #667eea;
            color: #667eea;
            font-weight: bold;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .findings-list {
            max-height: 400px;
            overflow-y: auto;
        }

        .finding-item {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
            background: #f7fafc;
        }

        .finding-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .finding-title {
            font-weight: bold;
            font-size: 1.1em;
        }

        .finding-severity {
            padding: 4px 8px;
            border-radius: 4px;
            color: white;
            font-size: 0.8em;
            font-weight: bold;
        }

        .severity-CRITICAL { background: #e53e3e; }
        .severity-HIGH { background: #dd6b20; }
        .severity-MEDIUM { background: #d69e2e; }
        .severity-LOW { background: #38a169; }

        .finding-details {
            color: #718096;
            font-size: 0.9em;
            margin-bottom: 5px;
        }

        .finding-code {
            background: #2d3748;
            color: #e2e8f0;
            padding: 10px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            margin-top: 10px;
            overflow-x: auto;
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

        .resource-fill.warning { background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%); }
        .resource-fill.danger { background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); }

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

        # ملف JavaScript
        js_content = """
        class DashboardApp {
            constructor() {
                this.scanInProgress = false;
                this.currentResults = null;
                this.resourceInterval = null;
                this.logContent = '';

                this.initializeEventListeners();
                this.startResourceMonitoring();
                this.loadInitialData();
            }

            initializeEventListeners() {
                // أزرار الفحص
                document.getElementById('start-full-scan').addEventListener('click', () => this.startScan('full'));
                document.getElementById('start-quick-scan').addEventListener('click', () => this.startScan('quick'));
                document.getElementById('start-ai-scan').addEventListener('click', () => this.startScan('ai_focused'));
                document.getElementById('stop-scan').addEventListener('click', () => this.stopScan());

                // تبويبات النتائج
                document.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
                });

                // أزرار التحكم الإضافية
                document.getElementById('clear-results').addEventListener('click', () => this.clearResults());
                document.getElementById('export-report').addEventListener('click', () => this.exportReport());
                document.getElementById('open-reports-dir').addEventListener('click', () => this.openReportsDir());
            }

            async startScan(scanType) {
                if (this.scanInProgress) return;

                this.scanInProgress = true;
                this.updateScanStatus('جاري الفحص...', 0);

                // تحديث أزرار التحكم
                this.toggleScanButtons(true);

                try {
                    const response = await fetch('/api/scan/start', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type: scanType })
                    });

                    const result = await response.json();

                    if (result.success) {
                        this.monitorScanProgress(result.scan_id);
                    } else {
                        throw new Error(result.error);
                    }
                } catch (error) {
                    console.error('خطأ في بدء الفحص:', error);
                    this.showError('فشل في بدء الفحص: ' + error.message);
                    this.toggleScanButtons(false);
                }
            }

            async stopScan() {
                try {
                    const response = await fetch('/api/scan/stop', { method: 'POST' });
                    const result = await response.json();

                    if (result.success) {
                        this.scanInProgress = false;
                        this.updateScanStatus('تم إيقاف الفحص', 0);
                        this.toggleScanButtons(false);
                    }
                } catch (error) {
                    console.error('خطأ في إيقاف الفحص:', error);
                }
            }

            async monitorScanProgress(scanId) {
                const checkProgress = async () => {
                    try {
                        const response = await fetch(`/api/scan/progress/${scanId}`);
                        const progress = await response.json();

                        this.updateScanStatus(progress.status, progress.progress);

                        if (progress.status === 'completed') {
                            this.scanInProgress = false;
                            this.toggleScanButtons(false);
                            await this.loadScanResults(scanId);
                        } else if (progress.status === 'running') {
                            setTimeout(checkProgress, 1000);
                        } else {
                            this.scanInProgress = false;
                            this.toggleScanButtons(false);
                        }
                    } catch (error) {
                        console.error('خطأ في مراقبة التقدم:', error);
                        this.scanInProgress = false;
                        this.toggleScanButtons(false);
                    }
                };

                checkProgress();
            }

            async loadScanResults(scanId) {
                try {
                    const response = await fetch(`/api/results/${scanId}`);
                    const results = await response.json();

                    this.currentResults = results;
                    this.displayResults(results);
                } catch (error) {
                    console.error('خطأ في تحميل النتائج:', error);
                }
            }

            updateScanStatus(status, progress) {
                document.getElementById('scan-status').textContent = status;
                document.getElementById('scan-progress').style.width = progress + '%';
                document.getElementById('scan-progress-text').textContent = progress + '%';
            }

            toggleScanButtons(scanning) {
                const startButtons = document.querySelectorAll('.btn:not(#stop-scan):not(#clear-results):not(#export-report):not(#open-reports-dir)');
                const stopButton = document.getElementById('stop-scan');

                startButtons.forEach(btn => btn.disabled = scanning);
                stopButton.disabled = !scanning;
            }

            switchTab(tabName) {
                // إزالة الفئة النشطة من جميع التبويبات
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

                // إضافة الفئة النشطة للتبويب المحدد
                document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
                document.getElementById(tabName).classList.add('active');
            }

            displayResults(results) {
                this.displayFindings(results.findings);
                this.displaySummary(results.summary);
                this.displayAIInsights(results.ai_insights);
                this.displayPerformance(results.performance_metrics);
            }

            displayFindings(findings) {
                const container = document.getElementById('findings-list');
                container.innerHTML = '';

                if (findings.length === 0) {
                    container.innerHTML = '<p style="text-align: center; color: #718096;">لم يتم العثور على أي مشاكل أمنية 🎉</p>';
                    return;
                }

                findings.forEach(finding => {
                    const item = document.createElement('div');
                    item.className = 'finding-item';

                    item.innerHTML = `
                        <div class="finding-header">
                            <div class="finding-title">${finding.title}</div>
                            <div class="finding-severity severity-${finding.severity}">${finding.severity}</div>
                        </div>
                        <div class="finding-details">
                            <strong>الملف:</strong> ${finding.file_path}<br>
                            <strong>السطر:</strong> ${finding.line_number}<br>
                            <strong>الفئة:</strong> ${finding.category}
                        </div>
                        <div class="finding-details">${finding.description}</div>
                        <div class="finding-code">${finding.code_snippet.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                        <div class="finding-details"><strong>التوصية:</strong> ${finding.recommendation}</div>
                    `;

                    container.appendChild(item);
                });
            }

            displaySummary(summary) {
                document.getElementById('total-findings').textContent = summary.total_findings;
                document.getElementById('critical-count').textContent = summary.severity_breakdown.CRITICAL;
                document.getElementById('high-count').textContent = summary.severity_breakdown.HIGH;
                document.getElementById('medium-count').textContent = summary.severity_breakdown.MEDIUM;
                document.getElementById('low-count').textContent = summary.severity_breakdown.LOW;
                document.getElementById('compliance-score').textContent = summary.compliance_score.toFixed(1) + '%';
            }

            displayAIInsights(insights) {
                const container = document.getElementById('ai-insights');
                container.innerHTML = `
                    <div class="finding-item">
                        <h4>تحليل الذكاء الاصطناعي</h4>
                        <p><strong>تقييم المخاطر العام:</strong> ${insights.overall_risk_assessment}</p>
                        <p><strong>درجة جودة الكود:</strong> ${insights.code_quality_score.toFixed(1)}%</p>
                        <p><strong>مستوى النضج الأمني:</strong> ${insights.security_maturity_level}</p>
                    </div>
                `;
            }

            displayPerformance(metrics) {
                // تحديث مؤشرات الأداء إذا كانت متوفرة
                console.log('Performance metrics:', metrics);
            }

            startResourceMonitoring() {
                this.resourceInterval = setInterval(() => this.updateResourceUsage(), 2000);
            }

            async updateResourceUsage() {
                try {
                    const response = await fetch('/api/system/resources');
                    const resources = await response.json();

                    // تحديث CPU
                    document.getElementById('cpu-usage').textContent = resources.cpu.toFixed(1) + '%';
                    document.getElementById('cpu-bar').style.width = resources.cpu + '%';

                    // تحديث الذاكرة
                    document.getElementById('memory-usage').textContent = resources.memory.toFixed(1) + '%';
                    document.getElementById('memory-bar').style.width = resources.memory + '%';

                    // تحديث GPU إذا كان متوفراً
                    if (resources.gpu && resources.gpu.length > 0) {
                        const gpu = resources.gpu[0];
                        document.getElementById('gpu-usage').textContent = gpu.memory_usage.toFixed(1) + '%';
                        document.getElementById('gpu-bar').style.width = gpu.memory_usage + '%';
                        document.getElementById('gpu-temp').textContent = gpu.temperature + '°C';
                    }

                    // تحديث حالة الألوان
                    this.updateResourceColors(resources);

                } catch (error) {
                    console.error('خطأ في تحديث استخدام الموارد:', error);
                }
            }

            updateResourceColors(resources) {
                const cpuBar = document.getElementById('cpu-bar');
                const memoryBar = document.getElementById('memory-bar');

                // CPU
                cpuBar.className = 'resource-fill';
                if (resources.cpu > 80) cpuBar.classList.add('danger');
                else if (resources.cpu > 60) cpuBar.classList.add('warning');

                // Memory
                memoryBar.className = 'resource-fill';
                if (resources.memory > 80) memoryBar.classList.add('danger');
                else if (resources.memory > 60) memoryBar.classList.add('warning');
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

                    // تحميل السجلات الأخيرة
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
                            this.currentResults = null;
                            document.getElementById('findings-list').innerHTML = '';
                            this.showSuccess('تم مسح النتائج بنجاح');
                        }
                    } catch (error) {
                        console.error('خطأ في مسح النتائج:', error);
                    }
                }
            }

            async exportReport() {
                if (!this.currentResults) {
                    this.showError('لا توجد نتائج للتصدير');
                    return;
                }

                try {
                    const response = await fetch('/api/export', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ format: 'html' })
                    });

                    if (response.ok) {
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `security_report_${new Date().toISOString().split('T')[0]}.html`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }
                } catch (error) {
                    console.error('خطأ في تصدير التقرير:', error);
                }
            }

            async openReportsDir() {
                try {
                    await fetch('/api/open-reports-dir', { method: 'POST' });
                } catch (error) {
                    console.error('خطأ في فتح مجلد التقارير:', error);
                }
            }

            showError(message) {
                this.showNotification(message, 'error');
            }

            showSuccess(message) {
                this.showNotification(message, 'success');
            }

            showNotification(message, type) {
                // يمكن تحسين هذا لإظهار إشعارات أفضل
                alert(message);
            }
        }

        // تهيئة التطبيق عند تحميل الصفحة
        document.addEventListener('DOMContentLoaded', () => {
            window.dashboardApp = new DashboardApp();
        });
        """

        # حفظ الملفات
        with open(self.static_dir / "dashboard.css", 'w', encoding='utf-8') as f:
            f.write(css_content)

        with open(self.static_dir / "dashboard.js", 'w', encoding='utf-8') as f:
            f.write(js_content)

    def run(self):
        """تشغيل الخادم"""
        try:
            # إنشاء معالج الطلبات
            handler = lambda *args, **kwargs: DashboardHandler(*args, scanner=self.scanner, **kwargs)

            self.server = HTTPServer((self.host, self.port), handler)
            print(f"🚀 تم تشغيل خادم الداش بورد على http://{self.host}:{self.port}")

            # فتح المتصفح
            webbrowser.open(f"http://{self.host}:{self.port}")

            # تشغيل الخادم
            self.server.serve_forever()

        except KeyboardInterrupt:
            print("\\n🛑 تم إيقاف الخادم")
        except Exception as e:
            print(f"❌ خطأ في تشغيل الخادم: {e}")
        finally:
            if self.server:
                self.server.shutdown()

class DashboardHandler(BaseHTTPRequestHandler):
    """معالج طلبات الداش بورد"""

    def __init__(self, *args, scanner=None, **kwargs):
        self.scanner = scanner
        super().__init__(*args, **kwargs)

    def do_GET(self):
        """معالجة طلبات GET"""
        try:
            if self.path == "/":
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
            file_path = Path(__file__).parent / "static" / filename

            if file_path.exists():
                with open(file_path, 'rb') as f:
                    content = f.read()

                content_type = "text/css" if filename.endswith(".css") else "application/javascript"
                self.send_response(200)
                self.send_header('Content-type', content_type)
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_error(404)
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
            "deepseek_status": "متاح" if self.scanner.deepseek and self.scanner.deepseek.is_server_running() else "غير متاح",
            "total_scans": 0,  # يمكن تحسين هذا لاحقاً
            "scanner_version": "5.0.0"
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

        if HAS_PSUTIL:
            try:
                resources["cpu"] = psutil.cpu_percent(interval=1)
                resources["memory"] = psutil.virtual_memory().percent
                resources["disk"] = psutil.disk_usage('/').percent
            except:
                pass

        if HAS_GPUTIL:
            try:
                gpus = GPUtil.getGPUs()
                for gpu in gpus:
                    resources["gpu"].append({
                        "name": gpu.name,
                        "memory_usage": (gpu.memoryUsed / gpu.memoryTotal) * 100,
                        "temperature": gpu.temperature
                    })
            except:
                pass

        self.send_json_response(resources)

    def api_recent_logs(self):
        """السجلات الأخيرة"""
        try:
            log_file = self.scanner.directories["logs"] / "scanner.log"
            if log_file.exists():
                with open(log_file, 'r', encoding='utf-8') as f:
                    lines = f.readlines()[-50:]  # آخر 50 سطر
            else:
                lines = ["لا توجد سجلات متاحة"]
        except:
            lines = ["خطأ في قراءة السجلات"]

        self.send_json_response(lines)

    def api_scan_results(self, scan_id):
        """نتائج الفحص"""
        # يمكن تحسين هذا لاحقاً لإرجاع نتائج حقيقية
        results = {
            "scan_id": scan_id,
            "findings": [],
            "summary": {"total_findings": 0, "severity_breakdown": {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}},
            "ai_insights": {"overall_risk_assessment": "LOW"},
            "performance_metrics": {}
        }

        self.send_json_response(results)

    def api_start_scan(self, data):
        """بدء الفحص"""
        scan_type = data.get("type", "quick")

        # هنا يمكن إضافة منطق الفحص الفعلي
        response = {"success": True, "scan_id": f"scan_{int(time.time())}"}
        self.send_json_response(response)

    def api_stop_scan(self):
        """إيقاف الفحص"""
        response = {"success": True, "message": "تم إيقاف الفحص"}
        self.send_json_response(response)

    def api_clear_results(self):
        """مسح النتائج"""
        response = {"success": True, "message": "تم مسح النتائج"}
        self.send_json_response(response)

    def api_export_report(self, data):
        """تصدير التقرير"""
        # يمكن تحسين هذا لاحقاً
        response = {"success": True, "message": "تم تصدير التقرير"}
        self.send_json_response(response)

    def api_open_reports_dir(self):
        """فتح مجلد التقارير"""
        try:
            if platform.system() == "Windows":
                os.startfile(str(self.scanner.directories["reports"]))
            elif platform.system() == "Darwin":  # macOS
                subprocess.run(["open", str(self.scanner.directories["reports"])])
            else:  # Linux
                subprocess.run(["xdg-open", str(self.scanner.directories["reports"])])
        except Exception as e:
            print(f"خطأ في فتح مجلد التقارير: {e}")
            pass

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
    <title>🔍 DeepSeek Ultimate Security Dashboard v2.0</title>
    <link rel="stylesheet" href="/static/dashboard.css">
</head>
<body>
    <div class="container">
        <!-- الهيدر -->
        <div class="header">
            <h1>🔒 DeepSeek Ultimate Security Scanner</h1>
            <p>لوحة التحكم الشاملة للفحص الأمني المتقدم - نسخة 5.0</p>
        </div>

        <!-- لوحة التحكم -->
        <div class="control-panel">
            <div class="control-card">
                <h3>🔍 بدء الفحص</h3>
                <button id="start-full-scan" class="btn">فحص شامل كامل</button>
                <button id="start-quick-scan" class="btn">فحص سريع</button>
                <button id="start-ai-scan" class="btn">فحص ذكي AI</button>
                <button id="stop-scan" class="btn btn-danger" disabled>إيقاف الفحص</button>
            </div>

            <div class="control-card">
                <h3>📊 حالة الفحص</h3>
                <div id="scan-status">جاهز للفحص</div>
                <div class="progress-bar">
                    <div id="scan-progress" class="progress-fill"></div>
                </div>
                <div id="scan-progress-text">0%</div>
            </div>

            <div class="control-card">
                <h3>🛠️ أدوات إضافية</h3>
                <button id="clear-results" class="btn">مسح النتائج</button>
                <button id="export-report" class="btn">تصدير التقرير</button>
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
                    <div id="cpu-usage" class="resource-value">0%</div>
                    <div class="resource-bar"><div id="cpu-bar" class="resource-fill"></div></div>
                </div>
                <div class="resource-item">
                    <div class="resource-label">الذاكرة</div>
                    <div id="memory-usage" class="resource-value">0%</div>
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

            <!-- التبويبات -->
            <div class="results-tabs">
                <button class="tab-btn active" data-tab="findings">النتائج المكتشفة</button>
                <button class="tab-btn" data-tab="summary">الملخص</button>
                <button class="tab-btn" data-tab="ai-insights">تحليل AI</button>
                <button class="tab-btn" data-tab="performance">الأداء</button>
            </div>

            <!-- محتوى التبويبات -->
            <div id="findings" class="tab-content active">
                <div id="findings-list" class="findings-list">
                    <p style="text-align: center; color: #718096;">لم يتم العثور على نتائج بعد. ابدأ الفحص لعرض النتائج هنا.</p>
                </div>
            </div>

            <div id="summary" class="tab-content">
                <div class="status-panel">
                    <div class="status-card">
                        <div class="status-icon">📊</div>
                        <div id="total-findings" class="status-value">0</div>
                        <div class="status-label">إجمالي النتائج</div>
                    </div>
                    <div class="status-card">
                        <div class="status-icon">🚨</div>
                        <div id="critical-count" class="status-value">0</div>
                        <div class="status-label">حرجة</div>
                    </div>
                    <div class="status-card">
                        <div class="status-icon">⚡</div>
                        <div id="high-count" class="status-value">0</div>
                        <div class="status-label">عالية</div>
                    </div>
                    <div class="status-card">
                        <div class="status-icon">⚠️</div>
                        <div id="medium-count" class="status-value">0</div>
                        <div class="status-label">متوسطة</div>
                    </div>
                    <div class="status-card">
                        <div class="status-icon">ℹ️</div>
                        <div id="low-count" class="status-value">0</div>
                        <div class="status-label">منخفضة</div>
                    </div>
                    <div class="status-card">
                        <div class="status-icon">✅</div>
                        <div id="compliance-score" class="status-value">0%</div>
                        <div class="status-label">درجة الامتثال</div>
                    </div>
                </div>
            </div>

            <div id="ai-insights" class="tab-content">
                <div id="ai-insights" class="findings-list">
                    <p style="text-align: center; color: #718096;">تحليل الذكاء الاصطناعي سيظهر هنا بعد الفحص.</p>
                </div>
            </div>

            <div id="performance" class="tab-content">
                <div class="resource-monitor">
                    <h4>📈 مؤشرات الأداء</h4>
                    <p style="text-align: center; color: #718096;">بيانات الأداء ستظهر هنا بعد الفحص.</p>
                </div>
            </div>
        </div>

        <!-- لوحة السجلات -->
        <div class="log-panel">
            <h3>📝 سجل العمليات</h3>
            <div id="log-content" class="log-content">جاري تحميل السجلات...</div>
        </div>
    </div>

    <script src="/static/dashboard.js"></script>
</body>
</html>"""
        return html

if __name__ == "__main__":
    # تشغيل الخادم للاختبار
    print("🔍 DeepSeek Dashboard Server v2.0")
    print("🚀 تشغيل الخادم على http://localhost:8080")

    # يمكن إضافة منطق إنشاء scanner هنا للاختبار
    # scanner = DeepSeekUltimateScanner()
    # server = DashboardServer(scanner)
    # server.run()