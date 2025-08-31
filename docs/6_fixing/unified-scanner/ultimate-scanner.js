const fs = require('fs');
const path = require('path');

class UltimateScanner {
    constructor() {
        this.projectPath = path.resolve(__dirname, '../../..');
        this.issues = [];
        this.stats = { filesScanned: 0, linesScanned: 0, startTime: Date.now() };
        this.rules = this.initRules();
    }

    initRules() {
        return {
            security: [
                // XSS & Code Injection
                { pattern: /dangerouslySetInnerHTML/g, severity: 'CRITICAL', msg: 'XSS: dangerouslySetInnerHTML خطر أمني', fix: 'استخدم DOMPurify' },
                { pattern: /eval\s*\(/g, severity: 'CRITICAL', msg: 'Code Injection: eval() محظور', fix: 'تجنب eval تماماً' },
                { pattern: /innerHTML\s*=.*\+/g, severity: 'HIGH', msg: 'XSS: innerHTML مع concatenation', fix: 'استخدم textContent' },
                { pattern: /document\.write/g, severity: 'HIGH', msg: 'XSS: document.write خطر', fix: 'استخدم DOM methods' },
                { pattern: /window\[.*\]/g, severity: 'MEDIUM', msg: 'Dynamic property access', fix: 'استخدم explicit properties' },
                
                // SQL Injection
                { pattern: /SELECT.*FROM.*\+/g, severity: 'CRITICAL', msg: 'SQL Injection: استعلام مدمج', fix: 'استخدم prepared statements' },
                { pattern: /INSERT.*INTO.*\+/g, severity: 'CRITICAL', msg: 'SQL Injection: INSERT مدمج', fix: 'استخدم parameterized queries' },
                { pattern: /UPDATE.*SET.*\+/g, severity: 'CRITICAL', msg: 'SQL Injection: UPDATE مدمج', fix: 'استخدم prepared statements' },
                { pattern: /DELETE.*FROM.*\+/g, severity: 'CRITICAL', msg: 'SQL Injection: DELETE مدمج', fix: 'استخدم prepared statements' },
                
                // Data Storage & Privacy
                { pattern: /localStorage\.|sessionStorage\./g, severity: 'MEDIUM', msg: 'تخزين بيانات محلياً', fix: 'شفّر البيانات الحساسة' },
                { pattern: /password|secret|key|token/gi, severity: 'HIGH', msg: 'Hardcoded credentials', fix: 'استخدم environment variables' },
                { pattern: /api[_-]?key|access[_-]?token/gi, severity: 'CRITICAL', msg: 'API credentials exposed', fix: 'نقل إلى .env' },
                
                // HTTPS & Security Headers
                { pattern: /http:\/\/(?!localhost)/g, severity: 'MEDIUM', msg: 'HTTP instead of HTTPS', fix: 'استخدم HTTPS' },
                { pattern: /target="_blank"(?![^>]*rel="noopener")/g, severity: 'MEDIUM', msg: 'Missing rel="noopener"', fix: 'أضف rel="noopener noreferrer"' }
            ],
            
            quality: [
                // Console & Debug
                { pattern: /console\.(log|warn|error|info|debug)/g, severity: 'LOW', msg: 'Console statements في الكود', fix: 'استخدم proper logger' },
                { pattern: /debugger/g, severity: 'HIGH', msg: 'debugger statement متروك', fix: 'احذف debugger' },
                { pattern: /alert\s*\(/g, severity: 'MEDIUM', msg: 'alert() في الكود', fix: 'استخدم proper notifications' },
                
                // Code Quality
                { pattern: /var\s+/g, severity: 'MEDIUM', msg: 'استخدام var بدلاً من let/const', fix: 'استخدم let/const' },
                { pattern: /\b\d{4,}\b/g, severity: 'MEDIUM', msg: 'Magic numbers كبيرة', fix: 'استخدم named constants' },
                { pattern: /[^=!]==\s*[^=]/g, severity: 'MEDIUM', msg: 'مقارنة == بدلاً من ===', fix: 'استخدم ===' },
                { pattern: /function\s*\(\s*\)\s*\{[^}]{200,}\}/g, severity: 'HIGH', msg: 'دالة طويلة جداً', fix: 'قسم إلى دوال أصغر' },
                { pattern: /\/\*.*TODO.*\*\//gi, severity: 'LOW', msg: 'TODO comments', fix: 'أكمل المهام المعلقة' },
                { pattern: /\/\/.*FIXME.*$/gm, severity: 'MEDIUM', msg: 'FIXME comments', fix: 'أصلح المشاكل المعلقة' },
                
                // Unused Code
                { pattern: /import.*from.*['"].*['"];?\s*$/gm, severity: 'LOW', msg: 'Potential unused import', fix: 'تحقق من الاستخدام' },
                { pattern: /const\s+\w+\s*=.*(?=\n(?!.*\1))/g, severity: 'LOW', msg: 'Potentially unused variable', fix: 'احذف إذا غير مستخدم' }
            ],
            
            performance: [
                // Async Operations
                { pattern: /fs\.\w+Sync\(/g, severity: 'HIGH', msg: 'عملية FS متزامنة', fix: 'استخدم async/await' },
                { pattern: /JSON\.parse\(.*readFileSync/g, severity: 'HIGH', msg: 'Synchronous JSON parsing', fix: 'استخدم async file reading' },
                
                // Loops & Iterations
                { pattern: /for\s*\([^)]*\.length/g, severity: 'MEDIUM', msg: 'حلقة غير محسنة', fix: 'احفظ length في متغير' },
                { pattern: /while\s*\(true\)/g, severity: 'HIGH', msg: 'Infinite loop potential', fix: 'أضف break condition' },
                
                // DOM & Rendering
                { pattern: /document\.getElementById.*loop/g, severity: 'MEDIUM', msg: 'DOM query في loop', fix: 'احفظ reference خارج loop' },
                { pattern: /\+\s*""/g, severity: 'LOW', msg: 'تحويل نص غير فعال', fix: 'استخدم String()' },
                
                // Memory & Resources
                { pattern: /setInterval(?!.*clearInterval)/g, severity: 'MEDIUM', msg: 'setInterval بدون clear', fix: 'أضف clearInterval' },
                { pattern: /setTimeout(?!.*clearTimeout)/g, severity: 'LOW', msg: 'setTimeout بدون clear', fix: 'فكر في clearTimeout' }
            ],
            
            typescript: [
                { pattern: /:\s*any\b/g, severity: 'MEDIUM', msg: 'TypeScript: استخدام any', fix: 'حدد نوع دقيق' },
                { pattern: /@ts-ignore/g, severity: 'HIGH', msg: 'TypeScript: @ts-ignore', fix: 'أصلح الخطأ بدلاً من إخفاءه' },
                { pattern: /@ts-nocheck/g, severity: 'HIGH', msg: 'TypeScript: @ts-nocheck', fix: 'أصلح أخطاء TypeScript' },
                { pattern: /as\s+any/g, severity: 'MEDIUM', msg: 'Type assertion to any', fix: 'استخدم type assertion محدد' }
            ],
            
            accessibility: [
                { pattern: /<img(?![^>]*alt=)/g, severity: 'MEDIUM', msg: 'Image بدون alt text', fix: 'أضف alt attribute' },
                { pattern: /<button(?![^>]*aria-label)(?![^>]*>.*<\/button>)/g, severity: 'LOW', msg: 'Button بدون accessible text', fix: 'أضف aria-label أو text' },
                { pattern: /<input(?![^>]*aria-label)(?![^>]*id=)/g, severity: 'LOW', msg: 'Input بدون label', fix: 'أضف label أو aria-label' }
            ],
            
            nx: [
                { pattern: /import.*\.\.\/\.\.\/\.\.\/.*libs/g, severity: 'MEDIUM', msg: 'NX: Deep relative imports', fix: 'استخدم barrel exports' },
                { pattern: /import.*apps\/.*\/src/g, severity: 'HIGH', msg: 'NX: Cross-app imports', fix: 'استخدم shared libraries' },
                { pattern: /process\.env(?!\.NODE_ENV)/g, severity: 'LOW', msg: 'NX: Direct env access', fix: 'استخدم NX environment config' }
            ],
            
            iso: [
                { pattern: /Math\.random\(\)/g, severity: 'MEDIUM', msg: 'ISO 27001: Weak randomness', fix: 'استخدم crypto.randomBytes' },
                { pattern: /new Date\(\)\.getTime\(\)/g, severity: 'LOW', msg: 'ISO 27001: Timestamp exposure', fix: 'فكر في الخصوصية' },
                { pattern: /console\.(log|error).*password|secret|key/gi, severity: 'CRITICAL', msg: 'ISO 27001: Credential logging', fix: 'لا تسجل بيانات حساسة' },
                { pattern: /fetch\(.*http:\/\//g, severity: 'HIGH', msg: 'ISO 27001: Insecure HTTP', fix: 'استخدم HTTPS فقط' }
            ]
        };
    }

    async scan() {
        // Removed console.log

        const files = this.getAllFiles();
        // Removed console.log
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileName = path.basename(file);
            
            process.stdout.write(`\r[${i+1}/${files.length}] ${fileName.substring(0, 40)}`);
            
            try {
                // Timeout لكل ملف (5 ثواني)
                await Promise.race([
                    this.scanFile(file),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout')), 5000)
                    )
                ]);
                this.stats.filesScanned++;
            } catch (error) {
                // تخطي الملفات المشكلة والمتابعة
                this.stats.filesScanned++;
            }
        }

        // Removed console.log
        const report = this.generateReport();
        await this.createHtmlReport(report);
        this.displayResults(report);

        return report;
    }

    getAllFiles() {
        const extensions = ['.js', '.ts', '.jsx', '.tsx', '.vue', '.json', '.md', '.yml', '.yaml', '.xml', '.html', '.css', '.scss', '.sass', '.less', '.py', '.php', '.java', '.cs', '.go', '.rb', '.swift', '.kt', '.scala', '.sh', '.bat', '.ps1', '.sql', '.dockerfile', '.tf', '.hcl'];
        return this.walkDir(this.projectPath, extensions);
    }

    walkDir(dir, extensions) {
        let files = [];
        try {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory() && !['node_modules', '.git'].includes(item)) {
                    files = files.concat(this.walkDir(fullPath, extensions));
                } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
                    files.push(fullPath);
                }
            }
        } catch (e) {}
        return files;
    }

    async scanFile(filePath) {
        try {
            // فحص سريع لحجم الملف
            const stats = fs.statSync(filePath);
            if (stats.size > 2 * 1024 * 1024) { // 2MB
                this.addIssue(filePath, 1, 'SIZE', 'MEDIUM', `Large file: ${Math.round(stats.size/1024/1024)}MB`, 'Consider splitting');
                return;
            }
            
            // تخطي الملفات المضغوطة
            const fileName = path.basename(filePath);
            if (fileName.includes('.min.') || fileName.includes('.bundle.') || fileName.includes('node_modules')) {
                return;
            }
            
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            this.stats.linesScanned += lines.length;

            // تطبيق جميع القواعد
            Object.entries(this.rules).forEach(([category, rules]) => {
                this.applyRules(filePath, content, lines, rules, category.toUpperCase());
            });

            // فحص الملفات الكبيرة
            if (content.length > 100000) {
                this.addIssue(filePath, 1, 'SIZE', 'MEDIUM', `Large file: ${Math.round(content.length/1000)}KB`, 'Consider splitting');
            }

            // فحص التعقيد
            const complexity = this.calculateComplexity(content);
            if (complexity > 15) {
                this.addIssue(filePath, 1, 'COMPLEXITY', 'HIGH', `High complexity: ${complexity}`, 'Simplify code');
            }

        } catch (e) {
            // تخطي الملفات المشكلة
        }
    }

    applyRules(filePath, content, lines, rules, category) {
        const isJsonFile = filePath.endsWith('.json') || filePath.includes('package-lock.json');
        
        rules.forEach(({ pattern, severity, msg, fix }) => {
            // تجاهل مشاكل == في ملفات JSON (hash padding)
            if (isJsonFile && msg.includes('مقارنة ==')) {
                return;
            }
            
            let match;
            while ((match = pattern.exec(content)) !== null) {
                const lineNum = content.substring(0, match.index).split('\n').length;
                const code = lines[lineNum - 1]?.trim() || '';
                
                // تجاهل == في hash strings
                if (msg.includes('مقارنة ==') && code.includes('"integrity"')) {
                    continue;
                }
                
                this.addIssue(filePath, lineNum, category, severity, msg, fix, code);
            }
        });
    }

    calculateComplexity(content) {
        const patterns = [/if\s*\(/g, /else/g, /while\s*\(/g, /for\s*\(/g, /switch\s*\(/g, /&&/g, /\|\|/g, /\?/g];
        return patterns.reduce((complexity, pattern) => {
            const matches = content.match(pattern);
            return complexity + (matches ? matches.length : 0);
        }, 1);
    }

    addIssue(file, line, category, severity, message, suggestion, code = '') {
        this.issues.push({
            id: `${category}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            file, line, category, severity, message, suggestion, code,
            timestamp: new Date().toISOString()
        });
    }

    generateReport() {
        const endTime = Date.now();
        const duration = endTime - this.stats.startTime;

        const bySeverity = this.groupBy('severity');
        const byCategory = this.groupBy('category');
        const byFile = this.issues.reduce((acc, issue) => {
            const fileName = path.basename(issue.file);
            acc[fileName] = (acc[fileName] || 0) + 1;
            return acc;
        }, {});

        const topFiles = Object.entries(byFile)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 15)
            .map(([file, count]) => ({ file, count }));

        const healthScore = this.calculateHealthScore(bySeverity, byCategory);
        const qualityMetrics = this.calculateQualityMetrics();

        return {
            timestamp: new Date().toISOString(),
            scanner: 'Ultimate Scanner v4.0',
            projectPath: this.projectPath,
            duration: Math.round(duration / 1000),
            stats: { ...this.stats, duration },
            totals: { issues: this.issues.length, bySeverity, byCategory },
            topFiles, healthScore, qualityMetrics,
            issues: this.issues
        };
    }

    calculateHealthScore(bySeverity, byCategory) {
        const severityWeights = { CRITICAL: 20, HIGH: 10, MEDIUM: 5, LOW: 2 };
        let totalPenalty = 0;
        Object.entries(bySeverity).forEach(([sev, count]) => {
            totalPenalty += (severityWeights[sev] || 1) * count;
        });
        return Math.max(0, Math.min(100, 100 - Math.min(100, totalPenalty / 2)));
    }

    calculateQualityMetrics() {
        const securityIssues = this.issues.filter(i => i.category === 'SECURITY').length;
        const performanceIssues = this.issues.filter(i => i.category === 'PERFORMANCE').length;
        const qualityIssues = this.issues.filter(i => i.category === 'QUALITY').length;

        return {
            securityScore: Math.max(0, 100 - securityIssues * 10),
            performanceScore: Math.max(0, 100 - performanceIssues * 5),
            qualityScore: Math.max(0, 100 - qualityIssues * 2),
            maintainabilityScore: Math.max(0, 100 - (this.issues.filter(i => i.severity === 'HIGH').length * 8))
        };
    }

    groupBy(field) {
        return this.issues.reduce((acc, issue) => {
            acc[issue[field]] = (acc[issue[field]] || 0) + 1;
            return acc;
        }, {});
    }

    async createHtmlReport(report) {
        const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ultimate Scanner Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        .header { background: rgba(255,255,255,0.95); color: #2c3e50; padding: 40px; border-radius: 20px; margin-bottom: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .header h1 { font-size: 3rem; margin-bottom: 15px; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; margin-bottom: 30px; }
        .stat-card { background: rgba(255,255,255,0.95); padding: 30px; border-radius: 15px; box-shadow: 0 15px 35px rgba(0,0,0,0.1); text-align: center; transition: transform 0.3s; }
        .stat-card:hover { transform: translateY(-10px); }
        .stat-number { font-size: 2.5rem; font-weight: bold; margin-bottom: 10px; }
        .health-score { color: ${report.healthScore > 80 ? '#27ae60' : report.healthScore > 60 ? '#f39c12' : '#e74c3c'}; }
        .section { background: rgba(255,255,255,0.95); border-radius: 15px; padding: 30px; margin-bottom: 25px; box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
        .section h2 { color: #2c3e50; margin-bottom: 25px; font-size: 1.8rem; border-bottom: 3px solid #ecf0f1; padding-bottom: 15px; }
        .severity-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; }
        .severity-card { padding: 20px; border-radius: 12px; text-align: center; font-weight: bold; transition: transform 0.3s; }
        .severity-card:hover { transform: scale(1.05); }
        .sev-CRITICAL { background: linear-gradient(135deg, #ff6b6b, #ee5a52); color: white; }
        .sev-HIGH { background: linear-gradient(135deg, #ffa726, #ff9800); color: white; }
        .sev-MEDIUM { background: linear-gradient(135deg, #ffee58, #fdd835); color: #333; }
        .sev-LOW { background: linear-gradient(135deg, #66bb6a, #4caf50); color: white; }
        .quality-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        .quality-metric { text-align: center; padding: 20px; background: #f8f9fa; border-radius: 10px; }
        .issues-table { width: 100%; border-collapse: collapse; margin-top: 25px; }
        .issues-table th, .issues-table td { padding: 15px; text-align: right; border-bottom: 1px solid #ecf0f1; }
        .issues-table th { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
        .issues-table tr:hover { background: #e3f2fd; }
        .file-path { font-family: 'Courier New', monospace; font-size: 0.9rem; color: #6c757d; }
        .suggestion { background: #e8f5e8; color: #2e7d32; padding: 8px; border-radius: 6px; font-size: 0.9rem; margin-top: 5px; }
        .top-files { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; }
        .file-item { background: #f8f9fa; padding: 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
        .file-count { background: #e74c3c; color: white; padding: 8px 15px; border-radius: 25px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Ultimate Scanner Report</h1>
            <div>الفاحص الشامل النهائي | ${new Date(report.timestamp).toLocaleString('ar-SA')}</div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${report.stats.filesScanned}</div>
                <div>ملف تم فحصه</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${report.stats.linesScanned.toLocaleString()}</div>
                <div>سطر تم فحصه</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${report.totals.issues}</div>
                <div>مشكلة مكتشفة</div>
            </div>
            <div class="stat-card">
                <div class="stat-number health-score">${report.healthScore}%</div>
                <div>نقاط الصحة</div>
            </div>
        </div>

        <div class="section">
            <h2>📊 مقاييس الجودة</h2>
            <div class="quality-metrics">
                <div class="quality-metric">
                    <div style="font-size: 2rem; color: #e74c3c;">${report.qualityMetrics.securityScore}%</div>
                    <div>نقاط الأمان</div>
                </div>
                <div class="quality-metric">
                    <div style="font-size: 2rem; color: #f39c12;">${report.qualityMetrics.performanceScore}%</div>
                    <div>نقاط الأداء</div>
                </div>
                <div class="quality-metric">
                    <div style="font-size: 2rem; color: #3498db;">${report.qualityMetrics.qualityScore}%</div>
                    <div>نقاط الجودة</div>
                </div>
                <div class="quality-metric">
                    <div style="font-size: 2rem; color: #9b59b6;">${report.qualityMetrics.maintainabilityScore}%</div>
                    <div>قابلية الصيانة</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>⚠️ توزيع المشاكل</h2>
            <div class="severity-grid">
                ${Object.entries(report.totals.bySeverity).map(([sev, count]) => `
                    <div class="severity-card sev-${sev}">
                        <div style="font-size: 2rem;">${count}</div>
                        <div>${sev}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="section">
            <h2>📁 أكثر الملفات مشاكل</h2>
            <div class="top-files">
                ${report.topFiles.map(item => `
                    <div class="file-item">
                        <div>${item.file}</div>
                        <div class="file-count">${item.count}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="section">
            <h2>🔍 تفاصيل المشاكل</h2>
            <table class="issues-table">
                <thead>
                    <tr><th>الملف</th><th>السطر</th><th>الفئة</th><th>الخطورة</th><th>الوصف والحل</th></tr>
                </thead>
                <tbody>
                    ${report.issues.slice(0, 200).map(issue => `
                        <tr>
                            <td class="file-path">${path.basename(issue.file)}</td>
                            <td>${issue.line}</td>
                            <td>${issue.category}</td>
                            <td><span class="severity-card sev-${issue.severity}" style="padding: 6px 12px; font-size: 0.8rem;">${issue.severity}</span></td>
                            <td>
                                <div>${issue.message}</div>
                                ${issue.suggestion ? `<div class="suggestion">💡 ${issue.suggestion}</div>` : ''}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div style="text-align: center; color: rgba(255,255,255,0.8); margin-top: 50px; padding: 30px;">
            <p>⚡ تم إنشاء التقرير في ${report.duration} ثانية | Ultimate Scanner v4.0</p>
        </div>
    </div>
</body>
</html>`;

        const reportPath = path.join(__dirname, 'latest-scan-report.html');
        fs.writeFileSync(reportPath, html);
        
        const jsonPath = path.join(__dirname, 'latest-scan-report.json');
        try {
            // تقليل حجم التقرير للملفات الكبيرة
            const lightReport = {
                ...report,
                issues: report.issues.slice(0, 1000) // أول 1000 مشكلة فقط
            };
            fs.writeFileSync(jsonPath, JSON.stringify(lightReport, null, 2));
        } catch (error) {
            // إنشاء تقرير مبسط في حالة الفشل
            const simpleReport = {
                timestamp: report.timestamp,
                totals: report.totals,
                healthScore: report.healthScore,
                topFiles: report.topFiles,
                issues: report.issues.slice(0, 100)
            };
            fs.writeFileSync(jsonPath, JSON.stringify(simpleReport, null, 2));
        }
        
        const { exec } = require('child_process');
        exec(`start "" "${reportPath}"`);

        return reportPath;
    }

    displayResults(report) {
        // Removed console.log
        // Removed console.log
        // Removed console.log
        // Removed console.log
        
        Object.entries(report.totals.bySeverity).forEach(([sev, count]) => {
            const icon = { CRITICAL: '🔴', HIGH: '🟠', MEDIUM: '🟡', LOW: '🟢' }[sev];
            // Removed console.log
        });
    }
}

async function main() {
    const scanner = new UltimateScanner();
    await scanner.scan();
}

main().catch(console.error);