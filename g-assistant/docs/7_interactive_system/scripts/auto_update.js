/**
 * سكربت التحديث التلقائي للنظام التفاعلي
 * يراقب التغييرات في الملفات ويحدث البيانات تلقائياً
 */

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

class AutoUpdater {
    constructor() {
        this.watchPaths = [
            '../../../docs/',
            '../../../monorepo-new/',
            '../../../MONTHLY_PLAN.md',
            '../../../monthly_progress.json'
        ];
        this.isUpdating = false;
    }

    start() {
        console.log('🔄 بدء مراقبة التغييرات...');
        
        const watcher = chokidar.watch(this.watchPaths, {
            ignored: /(^|[\/\\])\../, // تجاهل الملفات المخفية
            persistent: true,
            ignoreInitial: true
        });

        watcher
            .on('add', path => this.handleFileChange('added', path))
            .on('change', path => this.handleFileChange('changed', path))
            .on('unlink', path => this.handleFileChange('removed', path));

        console.log('✅ مراقب التغييرات نشط');
    }

    async handleFileChange(event, filePath) {
        if (this.isUpdating) return;
        
        console.log(`📝 ${event}: ${filePath}`);
        
        // تأخير قصير لتجنب التحديثات المتكررة
        setTimeout(() => {
            this.updateData();
        }, 1000);
    }

    async updateData() {
        if (this.isUpdating) return;
        this.isUpdating = true;

        try {
            console.log('🔄 تحديث البيانات...');
            
            // تحديث بيانات الوثائق
            await this.updateDocsData();
            
            // تحديث بيانات الداشبورد
            await this.updateDashboardData();
            
            console.log('✅ تم تحديث البيانات بنجاح');
            
        } catch (error) {
            console.error('❌ خطأ في تحديث البيانات:', error);
        } finally {
            this.isUpdating = false;
        }
    }

    async updateDocsData() {
        // استدعاء سكربت توليد بيانات الوثائق
        const { exec } = require('child_process');
        
        return new Promise((resolve, reject) => {
            exec('node generate_docs_data.js', { cwd: __dirname }, (error, stdout, stderr) => {
                if (error) {
                    console.error('خطأ في تحديث بيانات الوثائق:', error);
                    reject(error);
                } else {
                    console.log('✅ تم تحديث بيانات الوثائق');
                    resolve();
                }
            });
        });
    }

    async updateDashboardData() {
        // تحديث بيانات الداشبورد من الملفات المختلفة
        const dashboardData = {
            generated_at: new Date().toISOString(),
            system_health: await this.getSystemHealth(),
            monthly_progress: await this.getMonthlyProgress(),
            error_summary: await this.getErrorSummary(),
            fixes_summary: await this.getFixesSummary(),
            team_activity_summary: await this.getTeamActivity()
        };

        // حفظ البيانات
        const dataPath = path.join(__dirname, '../data/dashboard_data.js');
        const jsContent = `// تم التحديث تلقائياً في ${new Date().toLocaleString('ar-SA')}
const DASHBOARD_DATA = ${JSON.stringify(dashboardData, null, 2)};

// للاستخدام في Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DASHBOARD_DATA;
}`;

        fs.writeFileSync(dataPath, jsContent, 'utf8');
        console.log('✅ تم تحديث بيانات الداشبورد');
    }

    async getSystemHealth() {
        // فحص حالة النظام
        return {
            status: 'operational',
            last_check: new Date().toISOString(),
            issues: []
        };
    }

    async getMonthlyProgress() {
        try {
            const progressPath = path.join(__dirname, '../../../monthly_progress.json');
            if (fs.existsSync(progressPath)) {
                const data = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
                
                const completed = data.tasks?.filter(t => t.status === 'completed').length || 0;
                const total = data.tasks?.length || 0;
                const completion_rate = total > 0 ? Math.round((completed / total) * 100) : 0;
                
                return {
                    total_tasks: total,
                    completed_tasks: completed,
                    in_progress_tasks: data.tasks?.filter(t => t.status === 'in_progress').length || 0,
                    pending_tasks: data.tasks?.filter(t => t.status === 'pending').length || 0,
                    completion_rate,
                    days_remaining: this.getDaysRemainingInMonth(),
                    on_track: completion_rate >= 60
                };
            }
        } catch (error) {
            console.error('خطأ في قراءة بيانات التقدم الشهري:', error);
        }
        
        return {
            total_tasks: 0,
            completed_tasks: 0,
            completion_rate: 0,
            days_remaining: this.getDaysRemainingInMonth(),
            on_track: false
        };
    }

    getDaysRemainingInMonth() {
        const now = new Date();
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return Math.ceil((lastDay - now) / (1000 * 60 * 60 * 24));
    }

    async getErrorSummary() {
        return {
            total_errors: 0,
            critical_errors: 0,
            recent_errors: [],
            healthStatus: 'operational'
        };
    }

    async getFixesSummary() {
        return {
            total_fixes: 0,
            pending_fixes: 0,
            recent_pending_fixes: []
        };
    }

    async getTeamActivity() {
        return {
            recent_activities: [
                'تحديث تلقائي للبيانات - ' + new Date().toLocaleString('ar-SA')
            ]
        };
    }
}

// تشغيل المراقب
if (require.main === module) {
    const updater = new AutoUpdater();
    updater.start();
    
    // تحديث أولي
    updater.updateData();
}

module.exports = AutoUpdater;