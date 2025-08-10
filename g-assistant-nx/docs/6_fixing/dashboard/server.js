const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.DASHBOARD_PORT || 3001;
const ROOT_DIR = path.resolve(__dirname, '../../..'); // The root of g-assistant-nx

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
    console.log(`Request: ${req.method} ${req.url}`);

    // Enable CORS for all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    let filePath;
    
    // Special route for the daily boot file
    if (req.url === '/api/daily-boot') {
        filePath = path.join(ROOT_DIR, 'docs', '6_fixing', 'DAILY_BOOT.md');
    }
    // Routes for reports
    else if (req.url.startsWith('/reports/')) {
        const reportFile = req.url.replace('/reports/', '');
        filePath = path.join(ROOT_DIR, 'docs', '6_fixing', 'reports', reportFile);
    }
    // Routes for dashboard files
    else {
        // Serve static files from the dashboard directory
        let requestedUrl = req.url === '/' ? '/index.html' : req.url;
        filePath = path.join(__dirname, requestedUrl);
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n🚀 Dashboard server is running on http://localhost:${PORT}`);
    console.log(`📂 Serving files from: ${__dirname}`);
    console.log(`🔗 To view the dashboard, open your browser to http://localhost:3000`);
});