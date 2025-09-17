/**
 * 🔗 جسر التكامل بين ديب سيك و Deep Scan v2.0
 * Integration Bridge between DeepSeek and Deep Scan v2.0
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class IntegrationBridge {
    constructor() {
        this.deepSeekPath = __dirname;
        this.deepScanPath = path.join(__dirname, '../deep-scan-v2');
        this.reportsPath = path.join(__dirname, '../../reports');
        this.logsPath = path.join(__dirname, '../../logs');
        
        console.log('🔗 [Integration Bridge] تم تهيئة جسر التكامل');
    }

    /**
     * تشغيل النظامين معاً
     */
    async runIntegratedScan() {
        console.log('🚀 [Integration Bridge] بدء الفحص المتكامل...');
        
        try {
            // المرحلة 1: Deep Scan v2.0 للفحص السريع
            console.log('⚡ المرحلة 1: Deep Scan v2.0 - فحص سريع');
            const deepScanResults = await this.runDeepScanV2();
            
            // المرحلة 2: ديب سيك للتحليل العميق
            console.log('🔍 المرحلة 2: ديب سيك - تحليل عميق');
            const deepSeekResults = await this.runDeepSeek();
            
            // المرحلة 3: دمج النتائج
            console.log('📊 المرحلة 3: دمج النتائج');
            const unifiedResults = await this.mergeResults(deepScanResults, deepSeekResults);
            
            // المرحلة 4: إنشاء تقرير موحد
            console.log('📄 المرحلة 4: إنشاء تقرير موحد');
            await this.generateUnifiedReport(unifiedResults);
            
            console.log('✅ [Integration Bridge] تم الانتهاء من الفحص المتكامل');
            return unifiedResults;
            
        } catch (error) {
            console.error('❌ [Integration Bridge] خطأ في الفحص المتكامل:', error);
            throw error;
        }
    }

    /**
     * تشغيل Deep Scan v2.0
     */
    async runDeepScanV2() {
        console.log('🔍 تشغيل Deep Scan v2.0...');
        
        try {
            // التحقق من وجود Deep Scan v2.0
            if (!fs.existsSync(this.deepScanPath)) {
                throw new Error('Deep Scan v2.0 غير موجود');
            }
            
            // تشغيل الفحص السريع
            const command = `cd "${this.deepScanPath}" && node deep-scan-cli.js scan --output ../../../reports/deep-scan-integrated-${Date.now()}.json`;
            
            console.log('⚡ تنفيذ:', command);
            const output = execSync(command, { encoding: 'utf8', timeout: 300000 });
            
            console.log('✅ Deep Scan v2.0 مكتمل');
            return {
                type: 'deep-scan-v2',
                status: 'completed',
                output: output,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('❌ خطأ في Deep Scan v2.0:', error.message);
            return {
                type: 'deep-scan-v2',
                status: 'failed',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * تشغيل ديب سيك
     */
    async runDeepSeek() {
        console.log('🔍 تشغيل ديب سيك...');
        
        try {
            // التحقق من وجود Python و ديب سيك
            if (!fs.existsSync(path.join(this.deepSeekPath, 'deepseek_fixer.py'))) {
                throw new Error('ديب سيك غير موجود');
            }
            
            // تشغيل ديب سيك
            const command = `cd "${this.deepSeekPath}" && python deepseek_fixer.py`;
            
            console.log('🐍 تنفيذ:', command);
            const output = execSync(command, { encoding: 'utf8', timeout: 600000 });
            
            console.log('✅ ديب سيك مكتمل');
            return {
                type: 'deepseek',
                status: 'completed',
                output: output,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('❌ خطأ في ديب سيك:', error.message);
            return {
                type: 'deepseek',
                status: 'failed',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * دمج النتائج من النظامين
     */
    async mergeResults(deepScanResults, deepSeekResults) {
        console.log('📊 دمج النتائج...');
        
        const unifiedResults = {
            integrationInfo: {
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                systems: ['deep-scan-v2', 'deepseek']
            },
            summary: {
                totalSystems: 2,
                successfulSystems: 0,
                failedSystems: 0,
                totalIssuesFound: 0,
                totalIssuesFixed: 0
            },
            results: {
                deepScanV2: deepScanResults,
                deepSeek: deepSeekResults
            },
            recommendations: [],
            nextActions: []
        };

        // حساب الإحصائيات
        if (deepScanResults.status === 'completed') {
            unifiedResults.summary.successfulSystems++;
        } else {
            unifiedResults.summary.failedSystems++;
        }

        if (deepSeekResults.status === 'completed') {
            unifiedResults.summary.successfulSystems++;
        } else {
            unifiedResults.summary.failedSystems++;
        }

        // إضافة التوصيات
        if (unifiedResults.summary.successfulSystems === 2) {
            unifiedResults.recommendations.push('✅ كلا النظامين عمل بنجاح - النتائج موثوقة');
            unifiedResults.nextActions.push('مراجعة التقرير المفصل وتطبيق الإصلاحات المقترحة');
        } else if (unifiedResults.summary.successfulSystems === 1) {
            unifiedResults.recommendations.push('⚠️ نظام واحد فقط عمل - النتائج جزئية');
            unifiedResults.nextActions.push('فحص سبب فشل النظام الآخر وإعادة المحاولة');
        } else {
            unifiedResults.recommendations.push('❌ فشل كلا النظامين - يحتاج تدخل يدوي');
            unifiedResults.nextActions.push('فحص السجلات وحل المشاكل التقنية');
        }

        return unifiedResults;
    }

    /**
     * إنشاء تقرير موحد
     */
    async generateUnifiedReport(results) {
        console.log('📄 إنشاء تقرير موحد...');
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportPath = path.join(this.reportsPath, `unified-scan-report-${timestamp}.json`);
        
        // إنشاء مجلد التقارير إذا لم يكن موجوداً
        if (!fs.existsSync(this.reportsPath)) {
            fs.mkdirSync(this.reportsPath, { recursive: true });
        }
        
        // كتابة التقرير JSON
        fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
        
        // إنشاء تقرير HTML
        const htmlReport = this.generateHTMLReport(results);
        const htmlPath = path.join(this.reportsPath, `unified-scan-report-${timestamp}.html`);
        fs.writeFileSync(htmlPath, htmlReport);
        
        console.log(`📄 تم حفظ التقرير الموحد:`);
        console.log(`   JSON: ${reportPath}`);
        console.log(`   HTML: ${htmlPath}`);
        
        return { jsonPath: reportPath, htmlPath: htmlPath };
    }

    /**
     * إنشاء تقرير HTML
     */
    generateHTMLReport(results) {
        return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📊 تقرير الفحص المتكامل</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        .header { text-align: center; color: #333; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .stat-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-value { font-size: 2rem; font-weight: bold; color: #007bff; }
        .stat-label { color: #666; margin-top: 5px; }
        .section { margin: 30px 0; }
        .section h3 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        .result-card { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px; }
        .success { border-left: 4px solid #28a745; }
        .failed { border-left: 4px solid #dc3545; }
        .recommendations { background: #e7f3ff; padding: 20px; border-radius: 8px; }
        .footer { text-align: center; color: #666; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 تقرير الفحص المتكامل</h1>
            <p>ديب سيك + Deep Scan v2.0</p>
            <p><strong>التاريخ:</strong> ${new Date(results.integrationInfo.timestamp).toLocaleString('ar-SA')}</p>
        </div>
        
        <div class="summary">
            <div class="stat-card">
                <div class="stat-value">${results.summary.totalSystems}</div>
                <div class="stat-label">إجمالي الأنظمة</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${results.summary.successfulSystems}</div>
                <div class="stat-label">أنظمة ناجحة</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${results.summary.failedSystems}</div>
                <div class="stat-label">أنظمة فاشلة</div>
            </div>
        </div>
        
        <div class="section">
            <h3>🔍 نتائج الأنظمة</h3>
            
            <div class="result-card ${results.results.deepScanV2.status === 'completed' ? 'success' : 'failed'}">
                <h4>🚀 Deep Scan v2.0</h4>
                <p><strong>الحالة:</strong> ${results.results.deepScanV2.status === 'completed' ? '✅ مكتمل' : '❌ فاشل'}</p>
                <p><strong>الوقت:</strong> ${new Date(results.results.deepScanV2.timestamp).toLocaleString('ar-SA')}</p>
                ${results.results.deepScanV2.error ? `<p><strong>الخطأ:</strong> ${results.results.deepScanV2.error}</p>` : ''}
            </div>
            
            <div class="result-card ${results.results.deepSeek.status === 'completed' ? 'success' : 'failed'}">
                <h4>🔍 ديب سيك</h4>
                <p><strong>الحالة:</strong> ${results.results.deepSeek.status === 'completed' ? '✅ مكتمل' : '❌ فاشل'}</p>
                <p><strong>الوقت:</strong> ${new Date(results.results.deepSeek.timestamp).toLocaleString('ar-SA')}</p>
                ${results.results.deepSeek.error ? `<p><strong>الخطأ:</strong> ${results.results.deepSeek.error}</p>` : ''}
            </div>
        </div>
        
        <div class="section">
            <h3>💡 التوصيات</h3>
            <div class="recommendations">
                ${results.recommendations.map(rec => `<p>• ${rec}</p>`).join('')}
            </div>
        </div>
        
        <div class="section">
            <h3>🎯 الخطوات التالية</h3>
            <ul>
                ${results.nextActions.map(action => `<li>${action}</li>`).join('')}
            </ul>
        </div>
        
        <div class="footer">
            <p>🔗 تم إنشاء هذا التقرير بواسطة Integration Bridge v1.0</p>
        </div>
    </div>
</body>
</html>`;
    }

    /**
     * دمج النسخ الاحتياطية
     */
    async mergeBackups() {
        console.log('💾 دمج النسخ الاحتياطية...');
        
        const deepSeekBackups = path.join(this.deepSeekPath, 'backups');
        const deepScanBackups = path.join(this.deepScanPath, 'backups');
        
        // إنشاء رابط رمزي إذا لم يكن موجوداً
        if (!fs.existsSync(deepScanBackups) && fs.existsSync(deepSeekBackups)) {
            try {
                fs.symlinkSync(deepSeekBackups, deepScanBackups, 'dir');
                console.log('✅ تم ربط النسخ الاحتياطية');
            } catch (error) {
                console.log('⚠️ لا يمكن إنشاء رابط رمزي:', error.message);
            }
        }
    }

    /**
     * فحص صحة النظام المتكامل
     */
    async healthCheck() {
        console.log('🏥 فحص صحة النظام المتكامل...');
        
        const health = {
            deepSeek: {
                available: fs.existsSync(path.join(this.deepSeekPath, 'deepseek_fixer.py')),
                python: false,
                backups: fs.existsSync(path.join(this.deepSeekPath, 'backups'))
            },
            deepScanV2: {
                available: fs.existsSync(path.join(this.deepScanPath, 'deep-scan-cli.ts')),
                nodejs: false,
                typescript: false
            },
            integration: {
                reportsDir: fs.existsSync(this.reportsPath),
                logsDir: fs.existsSync(this.logsPath)
            }
        };

        // فحص Python
        try {
            execSync('python --version', { stdio: 'ignore' });
            health.deepSeek.python = true;
        } catch (error) {
            health.deepSeek.python = false;
        }

        // فحص Node.js
        try {
            execSync('node --version', { stdio: 'ignore' });
            health.deepScanV2.nodejs = true;
        } catch (error) {
            health.deepScanV2.nodejs = false;
        }

        // فحص TypeScript
        try {
            execSync('tsc --version', { stdio: 'ignore' });
            health.deepScanV2.typescript = true;
        } catch (error) {
            health.deepScanV2.typescript = false;
        }

        console.log('📊 نتائج فحص الصحة:');
        console.log(JSON.stringify(health, null, 2));
        
        return health;
    }
}

// تصدير الكلاس
module.exports = IntegrationBridge;

// تشغيل مباشر إذا تم استدعاء الملف
if (require.main === module) {
    const bridge = new IntegrationBridge();
    
    // فحص المعاملات
    const args = process.argv.slice(2);
    const command = args[0] || 'help';
    
    switch (command) {
        case 'scan':
            bridge.runIntegratedScan().catch(console.error);
            break;
        case 'health':
            bridge.healthCheck().catch(console.error);
            break;
        case 'merge-backups':
            bridge.mergeBackups().catch(console.error);
            break;
        case 'help':
        default:
            console.log(`
🔗 Integration Bridge - جسر التكامل

الاستخدام:
  node integration-bridge.js <command>

الأوامر:
  scan           تشغيل الفحص المتكامل
  health         فحص صحة النظام
  merge-backups  دمج النسخ الاحتياطية
  help           عرض هذه المساعدة

أمثلة:
  node integration-bridge.js scan
  node integration-bridge.js health
`);
            break;
    }
}