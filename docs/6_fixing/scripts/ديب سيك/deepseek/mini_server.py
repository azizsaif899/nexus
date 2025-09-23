#!/usr/bin/env python3
import http.server
import socketserver

PORT = 8080

class SimpleHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        html = """<!DOCTYPE html>
<html>
<head>
    <title>Dashboard Test</title>
    <style>body{background:#f0f0f0;text-align:center;padding:50px;}h1{color:#333;}</style>
</head>
<body>
    <h1>✅ الخادم يعمل بنجاح!</h1>
    <p>DeepSeek Security Dashboard - Windows Version</p>
    <p>المنفذ: 8080 | التاريخ: """ + __import__('time').strftime('%Y-%m-%d %H:%M:%S') + """</p>
</body>
</html>"""
        self.wfile.write(html.encode('utf-8'))

    def log_message(self, format, *args):
        pass

if __name__ == "__main__":
    print(f"Starting server on port {PORT}...")
    try:
        with socketserver.TCPServer(("", PORT), SimpleHandler) as httpd:
            print(f"Server running at http://localhost:{PORT}")
            httpd.serve_forever()
    except Exception as e:
        print(f"Error: {e}")