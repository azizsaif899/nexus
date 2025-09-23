#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
خادم داش بورد بسيط ومستقر - نسخة Windows
"""

import http.server
import socketserver
import threading
import time
import sys

PORT = 8080

class StableDashboardHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            print(f"طلب من: {self.client_address[0]} - {self.path}")

            if self.path == "/" or self.path == "/index.html":
                self.serve_main_page()
            else:
                self.send_error(404, "الصفحة غير موجودة")

        except Exception as e:
            print(f"خطأ في معالجة الطلب: {e}")
            self.send_error(500, str(e))

    def serve_main_page(self):
        """عرض الصفحة الرئيسية"""
        html = """<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔍 داش بورد الأمان - Windows</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
            direction: rtl;
        }
        .container {
            max-width: 800px;
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
        .status-card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 25px;
            margin: 20px 0;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .status-icon {
            font-size: 3em;
            margin-bottom: 15px;
        }
        .status-value {
            font-size: 1.8em;
            font-weight: bold;
            color: #4a5568;
        }
        .status-label {
            color: #718096;
            font-size: 1.1em;
        }
        .info-box {
            background: rgba(255, 255, 255, 0.9);
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            border-left: 5px solid #48bb78;
        }
        .warning-box {
            background: rgba(255, 255, 255, 0.9);
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            border-left: 5px solid #ed8936;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔒 DeepSeek Ultimate Security Scanner</h1>
            <p>لوحة التحكم الأمنية المتقدمة - نسخة Windows المستقرة</p>
        </div>

        <div class="status-card">
            <div class="status-icon">✅</div>
            <div class="status-value">الخادم يعمل</div>
            <div class="status-label">حالة الخادم</div>
        </div>

        <div class="status-card">
            <div class="status-icon">🖥️</div>
            <div class="status-value">Windows</div>
            <div class="status-label">نظام التشغيل</div>
        </div>

        <div class="status-card">
            <div class="status-icon">🌐</div>
            <div class="status-value">localhost:8080</div>
            <div class="status-label">عنوان الخادم</div>
        </div>

        <div class="info-box">
            <h3>📋 معلومات النظام</h3>
            <p><strong>الخادم:</strong> يعمل بنجاح على Windows</p>
            <p><strong>المنفذ:</strong> 8080</p>
            <p><strong>الحالة:</strong> متصل ومستقر</p>
            <p><strong>التاريخ:</strong> """ + time.strftime("%Y-%m-%d %H:%M:%S") + """</p>
        </div>

        <div class="warning-box">
            <h3>⚠️ تنبيه</h3>
            <p>هذه نسخة مبسطة من لوحة التحكم. للحصول على الماسح الأمني الكامل:</p>
            <ul style="text-align: right; margin-top: 10px;">
                <li>تأكد من تثبيت المكتبات المطلوبة</li>
                <li>استخدم <code>python run_dashboard.py</code> للنسخة الكاملة</li>
                <li>تحقق من ملف <code>deepseek_ultimate_scanner.py</code></li>
            </ul>
        </div>

        <div class="status-card">
            <div class="status-icon">🔄</div>
            <div class="status-value">جاهز للاستخدام</div>
            <div class="status-label">حالة النظام</div>
        </div>
    </div>

    <script>
        // تحديث تلقائي للتاريخ والوقت
        setInterval(function() {
            const now = new Date();
            const timeString = now.toLocaleString('ar-SA');
            console.log('الخادم نشط - ' + timeString);
        }, 30000); // كل 30 ثانية

        console.log('✅ داش بورد Windows جاهز للعمل!');
    </script>
</body>
</html>"""

        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(html.encode('utf-8'))
        print("✅ تم إرسال الصفحة الرئيسية بنجاح")

    def log_message(self, format, *args):
        """تسجيل الرسائل مع ترميز UTF-8"""
        print(f"[LOG] {self.address_string()} - {format % args}")

def run_server():
    """تشغيل الخادم بطريقة مستقرة"""
    print("🔍 بدء تشغيل خادم داش بورد Windows...")
    print(f"🌐 العنوان: http://localhost:{PORT}")
    print("=" * 50)

    try:
        # إنشاء الخادم
        with socketserver.TCPServer(("localhost", PORT), StableDashboardHandler) as httpd:
            print("✅ الخادم جاهز وينتظر الطلبات...")
            print("🛑 اضغط Ctrl+C لإيقاف الخادم")

            # تشغيل الخادم
            httpd.serve_forever()

    except KeyboardInterrupt:
        print("\\n🛑 تم إيقاف الخادم بواسطة المستخدم")
    except Exception as e:
        print(f"❌ خطأ في تشغيل الخادم: {e}")
        print("تأكد من أن المنفذ 8080 غير مستخدم")
        return False

    return True

if __name__ == "__main__":
    success = run_server()
    if not success:
        sys.exit(1)