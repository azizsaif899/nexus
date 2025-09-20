/**
 * لوحة تحكم الإصلاح الذاتي - JavaScript
 */

class AutoRepairDashboard {
    constructor() {
        this.reportsPath = '../reports/';
        this.charts = {};
        this.refreshInterval = 30000; // 30 ثانية
        
        this.init();
    }

    async init() {
        await this.loadDashboardData();
        this.startAutoRefresh();
    }

    // تحميل بيانات اللوحة
    async loadDashboardData() {
        try {
            // Removed console.log
            
            // تحميل اللوحة المركزية
            const centralDashboard = await this.loadJSON('nx_central_dashboard.json');
            
            // تحميل تقارير إضافية
            const scanResults = await this.loadJSON('scan_results.json');
            const detectedErrors = await this.loadJSON('detected_errors.json');
            
            // تحديث الواجهة
            this.updateSystemStatus(centralDashboard);
            this.updateErrorsCard(detectedErrors, centralDashboard);
            this.updateFilesCard(scanResults);
            this.updateTasksCard(centralDashboard);
            this.updateCharts(detectedErrors);
            this.updateLastUpdate(centralDashboard);
            
            // Removed console.log
            
        } catch (error) {
            console.error('❌ خطأ في تحميل البيانات:', error);
            this.showError('فشل في تحميل البيانات. تأكد من وجود التقارير.');
        }
    }

    // تحميل ملف JSON
    async loadJSON(filename) {
        try {
            const response = await fetch(this.reportsPath + filename);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${filename}`);
            }
            return await response.json();
        } catch (error) {
            console.warn(`⚠️ تعذر تحميل ${filename}:`, error.message);
            return null;
        }
    }

    // تحديث حالة النظام
    updateSystemStatus(dashboard) {
        if (!dashboard) return;

        const statusElement = document.getElementById('system-status');
        const healthProgress = document.getElementById('health-progress');
        const healthScore = document.getElementById('health-score');

        const status = dashboard.status || 'UNKNOWN';
        const score = dashboard.metrics?.healthScore || 0;

        // تحديث النص والألوان
        statusElement.textContent = this.getStatusText(status);
        statusElement.className = `metric-value ${this.getStatusClass(status)}`;

        // تحديث شريط التقدم
        healthProgress.style.width = `${score}%`;
        healthProgress.className = `progress-fill ${this.getStatusBg(status)}`;

        // تحديث نقاط الصحة
        healthScore.textContent = `نقاط الصحة: ${score}%`;
    }

    // تحديث بطاقة الأخطاء
    updateErrorsCard(errorsData, dashboard) {
        const totalErrorsElement = document.getElementById('total-errors');
        const errorsBreakdown = document.getElementById('errors-breakdown');

        if (errorsData && errorsData.errors) {
            const totalErrors = errorsData.totalErrors || errorsData.errors.length;
            totalErrorsElement.textContent = totalErrors;

            // تفصيل الأخطاء حسب الخطورة
            const breakdown = errorsData.errorsBySeverity || {};
            const critical = breakdown.error || 0;
            const high = breakdown.warning || 0;
            const medium = breakdown.info || 0;

            errorsBreakdown.textContent = `حرجة: ${critical} | عالية: ${high} | متوسطة: ${medium}`;
        } else if (dashboard && dashboard.metrics) {
            totalErrorsElement.textContent = dashboard.metrics.totalErrors || 0;
            errorsBreakdown.textContent = 'لا توجد تفاصيل متاحة';
        } else {
            totalErrorsElement.textContent = '--';
            errorsBreakdown.textContent = 'لا توجد بيانات';
        }
    }

    // تحديث بطاقة الملفات
    updateFilesCard(scanData) {
        const totalFilesElement = document.getElementById('total-files');
        const filesBreakdown = document.getElementById('files-breakdown');

        if (scanData) {
            totalFilesElement.textContent = scanData.totalFiles || 0;

            // تفصيل الملفات حسب النوع
            const types = scanData.fileTypes || {};
            const typescript = types.typescript || 0;
            const javascript = types.javascript || 0;
            const json = types.json || 0;

            filesBreakdown.textContent = `TypeScript: ${typescript} | JavaScript: ${javascript} | JSON: ${json}`;
        } else {
            totalFilesElement.textContent = '--';
            filesBreakdown.textContent = 'لا توجد بيانات';
        }
    }

    // تحديث بطاقة المهام
    updateTasksCard(dashboard) {
        const tasksList = document.getElementById('tasks-list');

        if (!dashboard || !dashboard.tasks) {
            tasksList.innerHTML = '<div class="loading">لا توجد مهام</div>';
            return;
        }

        const tasks = dashboard.tasks;
        let html = '';

        // المهام المعلقة
        if (tasks.pending && tasks.pending.length > 0) {
            tasks.pending.forEach(task => {
                html += this.createTaskHTML(task, 'pending');
            });
        }

        // المهام قيد التنفيذ
        if (tasks.inProgress && tasks.inProgress.length > 0) {
            tasks.inProgress.forEach(task => {
                html += this.createTaskHTML(task, 'progress');
            });
        }

        // المهام المكتملة (آخر 3 فقط)
        if (tasks.completed && tasks.completed.length > 0) {
            tasks.completed.slice(-3).forEach(task => {
                html += this.createTaskHTML(task, 'completed');
            });
        }

        // المهام الفاشلة
        if (tasks.failed && tasks.failed.length > 0) {
            tasks.failed.forEach(task => {
                html += this.createTaskHTML(task, 'failed');
            });
        }

        if (html === '') {
            html = '<div class="loading">لا توجد مهام حالياً</div>';
        }

        tasksList.innerHTML = html;
    }

    // إنشاء HTML للمهمة
    createTaskHTML(task, status) {
        const statusIcons = {
            pending: 'fas fa-clock',
            progress: 'fas fa-spinner fa-spin',
            completed: 'fas fa-check',
            failed: 'fas fa-times'
        };

        const statusTexts = {
            pending: 'معلقة',
            progress: 'قيد التنفيذ',
            completed: 'مكتملة',
            failed: 'فشلت'
        };

        return `
            <div class="task-item task-${status}">
                <div>
                    <i class="${statusIcons[status]}"></i>
                    <span style="margin-right: 10px;">${task.title || task.id}</span>
                </div>
                <div style="font-size: 0.8rem; color: #666;">
                    ${statusTexts[status]}
                </div>
            </div>
        `;
    }

    // تحديث الرسوم البيانية
    updateCharts(errorsData) {
        this.updateErrorsTrendChart();
        this.updateErrorsDistributionChart(errorsData);
    }

    // رسم بياني لاتجاه الأخطاء
    updateErrorsTrendChart() {
        const ctx = document.getElementById('errors-trend-chart').getContext('2d');
        
        if (this.charts.errorsTrend) {
            this.charts.errorsTrend.destroy();
        }

        // بيانات وهمية للعرض - يمكن تحسينها لاحقاً
        const data = {
            labels: ['الأسبوع الماضي', 'منذ 6 أيام', 'منذ 5 أيام', 'منذ 4 أيام', 'منذ 3 أيام', 'أمس', 'اليوم'],
            datasets: [{
                label: 'عدد الأخطاء',
                data: [12, 8, 15, 6, 9, 4, 2],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };

        this.charts.errorsTrend = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // رسم بياني لتوزيع الأخطاء
    updateErrorsDistributionChart(errorsData) {
        const ctx = document.getElementById('errors-distribution-chart').getContext('2d');
        
        if (this.charts.errorsDistribution) {
            this.charts.errorsDistribution.destroy();
        }

        let data, labels;

        if (errorsData && errorsData.errorsBySource) {
            const sources = errorsData.errorsBySource;
            labels = Object.keys(sources);
            data = Object.values(sources);
        } else {
            // بيانات افتراضية
            labels = ['TypeScript', 'ESLint', 'Build'];
            data = [5, 3, 2];
        }

        this.charts.errorsDistribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#ef4444',
                        '#f59e0b',
                        '#3b82f6',
                        '#10b981',
                        '#8b5cf6'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // تحديث وقت آخر تحديث
    updateLastUpdate(dashboard) {
        const lastUpdateElement = document.getElementById('last-update');
        
        if (dashboard && dashboard.lastUpdate) {
            const date = new Date(dashboard.lastUpdate);
            lastUpdateElement.textContent = `آخر تحديث: ${date.toLocaleString('ar-SA')}`;
        } else {
            lastUpdateElement.textContent = 'آخر تحديث: غير متاح';
        }
    }

    // عرض رسالة خطأ
    showError(message) {
        const container = document.querySelector('.container');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        container.insertBefore(errorDiv, container.firstChild);
    }

    // بدء التحديث التلقائي
    startAutoRefresh() {
        setInterval(() => {
            this.loadDashboardData();
        }, this.refreshInterval);
    }

    // مساعدات للحالة
    getStatusText(status) {
        const statusTexts = {
            'HEALTHY': 'سليم',
            'WARNING': 'تحذير',
            'CRITICAL': 'حرج',
            'UNKNOWN': 'غير معروف'
        };
        return statusTexts[status] || status;
    }

    getStatusClass(status) {
        const statusClasses = {
            'HEALTHY': 'status-healthy',
            'WARNING': 'status-warning',
            'CRITICAL': 'status-critical'
        };
        return statusClasses[status] || 'status-info';
    }

    getStatusBg(status) {
        const statusBgs = {
            'HEALTHY': 'bg-healthy',
            'WARNING': 'bg-warning',
            'CRITICAL': 'bg-critical'
        };
        return statusBgs[status] || 'bg-info';
    }
}

// تشغيل اللوحة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new AutoRepairDashboard();
});

// دالة التحديث اليدوي
function loadDashboardData() {
    if (window.dashboard) {
        window.dashboard.loadDashboardData();
    }
}