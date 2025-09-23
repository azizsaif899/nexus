#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
نسخة مبسطة لاختبار الخادم
"""

import http.server
import socketserver
import json
import time
import subprocess

PORT = 8081  # منفذ مختلف للاختبار

class TestHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
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
        elif self.path.startswith('/api/check-script'):
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            result = {'running': False, 'script': 'test'}
            self.wfile.write(json.dumps(result).encode('utf-8'))
        elif self.path.startswith('/api/monitoring'):
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            result = {
                'type': 'reports',
                'items': [
                    {'time': '2024-01-15 10:30:00', 'content': 'تم الاختبار بنجاح'}
                ]
            }
            self.wfile.write(json.dumps(result).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not found')

    def do_POST(self):
        if self.path == '/api/run-script':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            result = {'success': True, 'output': 'تم التشغيل بنجاح'}
            self.wfile.write(json.dumps(result).encode('utf-8'))
        elif self.path == '/api/stop-script':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            result = {'success': True, 'message': 'تم الإيقاف'}
            self.wfile.write(json.dumps(result).encode('utf-8'))
        elif self.path == '/api/stop-all':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            result = {'success': True, 'message': 'تم إيقاف الكل'}
            self.wfile.write(json.dumps(result).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not found')

if __name__ == "__main__":
    print(f"🔍 تشغيل خادم الاختبار على المنفذ {PORT}...")
    print(f"🌐 العنوان: http://localhost:{PORT}")

    try:
        with socketserver.TCPServer(("", PORT), TestHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 تم إيقاف الخادم")
    except Exception as e:
        print(f"❌ خطأ: {e}")