#!/usr/bin/env node

/**
 * خادم بسيط للوحة التحكم
 * يخدم الملفات الثابتة ويوفر API للتقارير
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

class DashboardServer {
    constructor(port = 3000) {
        this.port = port;
        this.dashboardDir = __dirname;
        this.reportsDir = path.join(__dirname, '../reports');
        
        this.mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif',
            '.ico': 'image/x-icon'
        };
    }

    // بدء الخادم
    start() {
        const server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        server.listen(this.port, () => {
            console.log(`🚀 خادم لوحة التحكم يعمل على:`);
            console.log(`   http://localhost:${this.port}`);
            console.log(`📊 لوحة التحكم: http://localhost:${this.port}/`);
            console.log(`📁 التقارير: http://localhost:${this.port}/reports/`);
        });

        // معالجة إيقاف الخادم
        process.on('SIGINT', () => {
            console.log('\n🛑 إيقاف الخادم...');
            server.close(() => {
                console.log('✅ تم إيقاف الخادم');
                process.exit(0);
            });
        });
    }

    // معالجة الطلبات
    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        let pathname = parsedUrl.pathname;

        // إعداد CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        // الصفحة الرئيسية
        if (pathname === '/' || pathname === '/index.html') {
            this.serveFile(res, path.join(this.dashboardDir, 'index.html'));
            return;
        }

        // ملفات لوحة التحكم
        if (pathname.startsWith('/dashboard.')) {
            const filename = path.basename(pathname);
            this.serveFile(res, path.join(this.dashboardDir, filename));
            return;
        }

        // API للتقارير
        if (pathname.startsWith('/reports/')) {
            const reportName = pathname.replace('/reports/', '');
            this.serveReport(res, reportName);
            return;
        }

        // API لقائمة التقارير
        if (pathname === '/api/reports') {
            this.serveReportsList(res);
            return;
        }

        // API لحالة النظام
        if (pathname === '/api/status') {
            this.serveSystemStatus(res);
            return;
        }

        // API لمهام اليوم
        if (pathname === '/api/daily-boot') {
            this.serveDailyBoot(res);
            return;
        }

        // 404
        this.serve404(res);
    }

    // خدمة الملفات
    serveFile(res, filePath) {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(`❌ خطأ في قراءة الملف: ${filePath}`, err.message);
                this.serve404(res);
                return;
            }

            const ext = path.extname(filePath);
            const mimeType = this.mimeTypes[ext] || 'text/plain';

            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(data);
        });
    }

    // خدمة التقارير
    serveReport(res, reportName) {
        const reportPath = path.join(this.reportsDir, reportName);

        fs.readFile(reportPath, 'utf8', (err, data) => {
            if (err) {
                console.warn(`⚠️ تقرير غير موجود: ${reportName}`);
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'التقرير غير موجود' }));
                return;
            }

            try {
                // التحقق من صحة JSON
                JSON.parse(data);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            } catch (parseError) {
                console.error(`❌ خطأ في تحليل JSON: ${reportName}`, parseError.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'خطأ في تحليل التقرير' }));
            }
        });
    }

    // خدمة قائمة التقارير
    serveReportsList(res) {
        fs.readdir(this.reportsDir, (err, files) => {
            if (err) {
                console.error('❌ خطأ في قراءة مجلد التقارير:', err.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'خطأ في قراءة التقارير' }));
                return;
            }

            const reports = files
                .filter(file => file.endsWith('.json'))
                .map(file => {
                    const filePath = path.join(this.reportsDir, file);
                    const stats = fs.statSync(filePath);
                    return {
                        name: file,
                        size: stats.size,
                        lastModified: stats.mtime.toISOString()
                    };
                })
                .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ reports }));
        });
    }

    // خدمة حالة النظام
    serveSystemStatus(res) {
        const dashboardPath = path.join(this.reportsDir, 'nx_central_dashboard.json');
        
        fs.readFile(dashboardPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    status: 'UNKNOWN',
                    message: 'لا توجد بيانات متاحة',
                    timestamp: new Date().toISOString()
                }));
                return;
            }

            try {
                const dashboard = JSON.parse(data);
                const status = {
                    status: dashboard.status || 'UNKNOWN',
                    healthScore: dashboard.metrics?.healthScore || 0,
                    totalErrors: dashboard.metrics?.totalErrors || 0,
                    totalFiles: dashboard.metrics?.totalFiles || 0,
                    lastUpdate: dashboard.lastUpdate,
                    timestamp: new Date().toISOString()
                };

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(status));
            } catch (parseError) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'خطأ في تحليل بيانات النظام' }));
            }
        });
    }

    // خدمة مهام اليوم
    serveDailyBoot(res) {
        const bootPath = path.join(__dirname, '../DAILY_BOOT.md');
        
        fs.readFile(bootPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('لم يتم العثور على ملف المهام اليومية');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(data);
        });
    }

    // صفحة 404
    serve404(res) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>404 - الصفحة غير موجودة</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    h1 { color: #ef4444; }
                </style>
            </head>
            <body>
                <h1>404 - الصفحة غير موجودة</h1>
                <p>الصفحة المطلوبة غير متاحة.</p>
                <a href="/">العودة للوحة التحكم</a>
            </body>
            </html>
        `);
    }
}

// تشغيل الخادم
if (require.main === module) {
    const port = process.env.PORT || 3000;
    const server = new DashboardServer(port);
    server.start();
}

module.exports = DashboardServer;