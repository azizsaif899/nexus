#!/usr/bin/env python3
import http.server
import socketserver
import time

PORT = 8080

class SimpleHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        print(f"Received request: {self.path}")
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            html = """<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔍 Simple Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f0f0f0; text-align: center; padding: 50px; }
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; }
        h1 { color: #333; }
        p { color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 DeepSeek Security Dashboard</h1>
        <p>الخادم البسيط يعمل بنجاح!</p>
        <p>هذه نسخة مبسطة من لوحة التحكم الأمنية.</p>
        <p>✅ الخادم متصل ويعمل على localhost:8080</p>
    </div>
</body>
</html>"""
            self.wfile.write(html.encode('utf-8'))
            print("Sent response")
        else:
            self.send_error(404)

if __name__ == "__main__":
    print(f"Starting server on port {PORT}")
    try:
        with socketserver.TCPServer(("", PORT), SimpleHandler) as httpd:
            print(f"🚀 الخادم يعمل على http://localhost:{PORT}")
            print("Press Ctrl+C to stop")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("🛑 تم إيقاف الخادم")
    except Exception as e:
        print(f"Error: {e}")