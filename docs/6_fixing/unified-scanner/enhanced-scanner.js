const fs = require('fs');
const path = require('path');

class EnhancedScanner {
    constructor() {
        this.projectPath = path.resolve(__dirname, '../../..');
        this.issues = [];
        this.stats = { filesScanned: 0, linesScanned: 0, startTime: Date.now() };
        this.rules = this.initRules();
        this.falsePositiveFilters = this.initFalsePositiveFilters();
        this.ignorePatterns = this.initIgnorePatterns();
    }

    initIgnorePatterns() {
        return [
            /\.nx\/cache\//,
            /node_modules\//,
            /dist\//,
            /build\//,
            /\.d\.ts$/,
            /package-lock\.json$/,
            /\.min\.js$/,
            /\.bundle\.js$/,
            /\.map$/
        ];
    }

    initFalsePositiveFilters() {
        return {
            'Magic numbers كبيرة': {
                dates: /\b(19|20)\d{2}\b/,
                ports: /\b(3000|4000|4200|5000|5001|5173|8000|8080|8070|6379)\b/,
                versions: /\b\d+\.\d+\.\d+\b/,
                timestamps: /\b1[0-9]{9,12}\b/,
                hashes: /[a-f0-9]{8,}/i
            },
            'Hardcoded credentials': {
                configKeys: /^(name|version|description|keywords|scripts|dependencies)$/,
                yamlKeys: /^(env|NODE_ENV|PORT|HOST)$/,
                secretsPattern: /\$\{\{\s*secrets\./,
                envPattern: /process\.env\./
            },
            'Console statements في الكود': {
                comments: /\/\/ (Removed console\.|console\. removed)/,
                errorHandling: /console\.(error|warn)\s*\(/
            }
        };
    }

    initRules() {
        return {
            quality: [
                { pattern: /console\.(log|info|debug)\s*\(/g, severity: 'LOW', msg: 'Console statements في الكود', fix: 'استخدم proper logger' },
                { pattern: /var\s+/g, severity: 'MEDIUM', msg: 'استخدام var بدلاً من let/const', fix: 'استخدم let/const' },
                { pattern: /\/\*.*TODO.*\*\//gi, severity: 'LOW', msg: 'TODO comments', fix: 'أكمل المهام المعلقة' },
                { pattern: /\/\/.*FIXME.*$/gm, severity: 'MEDIUM', msg: 'FIXME comments', fix: 'أصلح المشاكل المعلقة' },
                { pattern: /debugger/g, severity: 'HIGH', msg: 'debugger statement متروك', fix: 'احذف debugger' }
            ],
            
            security: [
                { pattern: /eval\s*\(/g, severity: 'CRITICAL', msg: 'Code Injection: eval() محظور', fix: 'تجنب eval تماماً' },
                { pattern: /dangerouslySetInnerHTML/g, severity: 'CRITICAL', msg: 'XSS: dangerouslySetInnerHTML خطر أمني', fix: 'استخدم DOMPurify' },
                { pattern: /innerHTML\s*=.*\+/g, severity: 'HIGH', msg: 'XSS: innerHTML مع concatenation', fix: 'استخدم textContent' }
            ],
            
            performance: [
                { pattern: /fs\.\w+Sync\(/g, severity: 'HIGH', msg: 'عملية FS متزامنة', fix: 'استخدم async/await' },
                { pattern: /for\s*\([^)]*\.length/g, severity: 'MEDIUM', msg: 'حلقة غير محسنة', fix: 'احفظ length في متغير' }
            ]
        };
    }

    shouldIgnoreFile(filePath) {
        return this.ignorePatterns.some(pattern => pattern.test(filePath));
    }

    isFalsePositive(issue, code, filePath) {
        const filters = this.falsePositiveFilters[issue.message];
        if (!filters) return false;

        // فحص ملفات JSON
        if (filePath.endsWith('.json')) {
            if (issue.message.includes('Magic numbers') && 
                (filters.dates.test(code) || filters.ports.test(code) || filters.versions.test(code))) {
                return true;
            }
            if (issue.message.includes('Hardcoded credentials') && 
                filters.configKeys.test(code)) {
                return true;
            }
        }

        // فحص ملفات YAML/YML
        if (filePath.match(/\.(yml|yaml)$/)) {
            if (issue.message.includes('Hardcoded credentials') && 
                (filters.secretsPattern.test(code) || filters.envPattern.test(code))) {
                return true;
            }
        }

        // فحص Console statements
        if (issue.message.includes('Console statements') && 
            (filters.comments?.test(code) || filters.errorHandling?.test(code))) {
            return true;
        }

        return false;
    }

    isGeneratedFile(filePath) {
        const generatedPatterns = [
            /\.d\.ts$/,
            /\.min\.js$/,
            /\.bundle\.js$/,
            /\.nx\/cache\//,
            /node_modules\//,
            /dist\//,
            /build\//
        ];
        
        return generatedPatterns.some(pattern => pattern.test(filePath));
    }

    async scan() {
        console.log('🔍 Starting Enhanced Scanner...');
        
        const files = this.getAllFiles();
        console.log(`📁 Found ${files.length} files to scan`);
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileName = path.basename(file);
            
            // تخطي الملفات المتجاهلة
            if (this.shouldIgnoreFile(file)) {
                continue;
            }
            
            process.stdout.write(`\r[${i+1}/${files.length}] ${fileName.substring(0, 40)}`);
            
            try {
                await this.scanFile(file);
                this.stats.filesScanned++;
            } catch (error) {
                // تخطي الملفات المشكلة
                this.stats.filesScanned++;
            }
        }

        console.log('\n✅ Scan completed');
        const report = this.generateReport();
        await this.createJsonReport(report);
        
        return report;
    }

    getAllFiles() {
        const extensions = ['.js', '.ts', '.jsx', '.tsx', '.vue', '.json', '.md', '.yml', '.yaml'];
        return this.walkDir(this.projectPath, extensions);
    }

    walkDir(dir, extensions) {
        let files = [];
        try {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory() && !['node_modules', '.git', '.nx'].includes(item)) {
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
            const stats = fs.statSync(filePath);
            if (stats.size > 1024 * 1024) { // 1MB limit
                return;
            }
            
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            this.stats.linesScanned += lines.length;

            // تطبيق القواعد مع فلترة False Positives
            Object.entries(this.rules).forEach(([category, rules]) => {
                this.applyRulesWithFiltering(filePath, content, lines, rules, category.toUpperCase());
            });

        } catch (e) {
            // تخطي الملفات المشكلة
        }
    }

    applyRulesWithFiltering(filePath, content, lines, rules, category) {
        rules.forEach(({ pattern, severity, msg, fix }) => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                const lineNum = content.substring(0, match.index).split('\n').length;
                const code = lines[lineNum - 1]?.trim() || '';
                
                // فحص False Positives
                const issue = { message: msg, severity, category };
                if (this.isFalsePositive(issue, code, filePath)) {
                    continue;
                }
                
                // تخطي الملفات المُولدة للمشاكل البسيطة
                if (this.isGeneratedFile(filePath) && ['LOW', 'MEDIUM'].includes(severity)) {
                    continue;
                }
                
                this.addIssue(filePath, lineNum, category, severity, msg, fix, code);
            }
        });
    }

    addIssue(file, line, category, severity, message, suggestion, code = '') {
        this.issues.push({
            id: `${category}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            file: path.relative(this.projectPath, file),
            line, 
            category, 
            severity, 
            message, 
            suggestion, 
            code,
            timestamp: new Date().toISOString(),
            fixable: this.isFixable(message, file)
        });
    }

    isFixable(message, filePath) {
        const fixablePatterns = [
            'Console statements في الكود',
            'استخدام var بدلاً من let/const',
            'TODO comments',
            'FIXME comments',
            'debugger statement متروك'
        ];
        
        return fixablePatterns.includes(message) && !this.isGeneratedFile(filePath);
    }

    generateReport() {
        const endTime = Date.now();
        const duration = endTime - this.stats.startTime;

        const bySeverity = this.groupBy('severity');
        const byCategory = this.groupBy('category');
        const fixableIssues = this.issues.filter(i => i.fixable).length;
        
        return {
            timestamp: new Date().toISOString(),
            scanner: 'Enhanced Scanner v2.0',
            projectPath: this.projectPath,
            duration: Math.round(duration / 1000),
            stats: { 
                ...this.stats, 
                duration,
                totalIssues: this.issues.length,
                fixableIssues,
                fixablePercentage: Math.round((fixableIssues / this.issues.length) * 100) || 0
            },
            totals: { 
                issues: this.issues.length, 
                bySeverity, 
                byCategory,
                fixable: fixableIssues
            },
            issues: this.issues
        };
    }

    groupBy(field) {
        return this.issues.reduce((acc, issue) => {
            acc[issue[field]] = (acc[issue[field]] || 0) + 1;
            return acc;
        }, {});
    }

    async createJsonReport(report) {
        const jsonPath = path.join(__dirname, 'enhanced-scan-report.json');
        fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
        console.log(`📄 Report saved: ${jsonPath}`);
        return jsonPath;
    }
}

async function main() {
    const scanner = new EnhancedScanner();
    const report = await scanner.scan();
    
    console.log('\n📊 Enhanced Scan Results:');
    console.log(`📁 Files scanned: ${report.stats.filesScanned}`);
    console.log(`📝 Total issues: ${report.totals.issues}`);
    console.log(`🔧 Fixable issues: ${report.totals.fixable} (${report.stats.fixablePercentage}%)`);
    console.log(`⏱️ Duration: ${report.duration}s`);
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = EnhancedScanner;