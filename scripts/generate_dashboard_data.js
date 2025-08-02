const fs = require('fs');
const path = require('path');

// Paths
const DASHBOARD_DATA_PATH = path.join(__dirname, '../doc/dashboard_data.json');
const ERRORS_LOG_PATH = path.join(__dirname, '../logs/errors.log');
const FIXES_LOG_PATH = path.join(__dirname, '../fixes_log.md');
const TEAM_SYNC_PATH = path.join(__dirname, '../doc/TEAM_SYNC.md');
const STATUS_JSON_PATH = path.join(__dirname, '../status.json');
const MONTHLY_PROGRESS_PATH = path.join(__dirname, '../monthly_progress.json');

// Helper Functions
function readJsonFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch (error) {
        console.error(`Error reading JSON file ${filePath}:`, error.message);
    }
    return {};
}

function readTextFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf8');
        }
    } catch (error) {
        console.error(`Error reading text file ${filePath}:`, error.message);
    }
    return '';
}

function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`✅ Dashboard data written to ${filePath}`);
    } catch (error) {
        console.error(`Error writing JSON file ${filePath}:`, error.message);
    }
}

// Core Functions
function analyzeSystemHealth() {
    const status = readJsonFile(STATUS_JSON_PATH);
    const errorsLog = readTextFile(ERRORS_LOG_PATH);
    
    let healthStatus = 'operational';
    let issues = [];
    let serviceCount = 0;
    let operationalServices = 0;

    if (status.service_status) {
        for (const service in status.service_status) {
            serviceCount++;
            if (status.service_status[service] === 'operational') {
                operationalServices++;
            } else {
                issues.push(`${service}: ${status.service_status[service]}`);
                healthStatus = 'degraded';
            }
        }
    }

    const errorLines = errorsLog.split('\n').filter(line => 
        line.includes('ERROR') || line.includes('CRITICAL')
    );

    if (errorLines.length > 0) {
        healthStatus = 'critical';
        issues.push(`${errorLines.length} critical errors in logs`);
    }

    return {
        status: healthStatus,
        services_total: serviceCount,
        services_operational: operationalServices,
        issues: issues,
        error_count: errorLines.length,
        last_check: new Date().toISOString()
    };
}

function analyzePendingFixes() {
    const fixesContent = readTextFile(FIXES_LOG_PATH);
    const lines = fixesContent.split('\n');
    
    let totalFixes = 0;
    let pendingFixes = 0;
    let completedFixes = 0;
    let criticalFixes = 0;

    lines.forEach(line => {
        if (line.includes('الحالة:') || line.includes('Status:')) {
            totalFixes++;
            if (line.includes('معلقة') || line.includes('Pending')) {
                pendingFixes++;
            } else if (line.includes('مكتمل') || line.includes('Completed')) {
                completedFixes++;
            }
        }
        if (line.includes('حرج') || line.includes('Critical')) {
            criticalFixes++;
        }
    });

    return {
        total: totalFixes,
        pending: pendingFixes,
        completed: completedFixes,
        critical: criticalFixes,
        completion_rate: totalFixes > 0 ? Math.round((completedFixes / totalFixes) * 100) : 0
    };
}

function analyzeTeamActivity() {
    const teamSyncContent = readTextFile(TEAM_SYNC_PATH);
    const lines = teamSyncContent.split('\n');
    
    let totalTasks = 0;
    let newTasks = 0;
    let inProgressTasks = 0;
    let completedTasks = 0;
    let recentActivity = [];

    // Get recent dates (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    lines.forEach(line => {
        if (line.includes('**مهمة:**') || line.includes('**Task:**')) {
            totalTasks++;
        }
        if (line.includes('جديدة') || line.includes('New')) {
            newTasks++;
        }
        if (line.includes('قيد التنفيذ') || line.includes('In Progress')) {
            inProgressTasks++;
        }
        if (line.includes('مكتملة') || line.includes('Completed')) {
            completedTasks++;
        }
        
        // Extract recent activity
        const dateMatch = line.match(/## 🗓️ (\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
            const activityDate = new Date(dateMatch[1]);
            if (activityDate >= sevenDaysAgo) {
                recentActivity.push({
                    date: dateMatch[1],
                    type: 'task_update'
                });
            }
        }
    });

    return {
        total_tasks: totalTasks,
        new_tasks: newTasks,
        in_progress_tasks: inProgressTasks,
        completed_tasks: completedTasks,
        recent_activity_count: recentActivity.length,
        task_completion_rate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
}

function getMonthlyProgress() {
    const progress = readJsonFile(MONTHLY_PROGRESS_PATH);
    
    if (!progress.total_tasks) {
        return {
            total_tasks: 0,
            completed_tasks: 0,
            in_progress_tasks: 0,
            pending_tasks: 0,
            completion_rate: 0,
            days_remaining: 0,
            on_track: false
        };
    }

    // Calculate days remaining in month
    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysRemaining = Math.ceil((lastDayOfMonth - now) / (1000 * 60 * 60 * 24));
    
    // Determine if on track (simple heuristic)
    const expectedProgress = Math.round(((30 - daysRemaining) / 30) * 100);
    const actualProgress = Math.round((progress.completed_tasks / progress.total_tasks) * 100);
    const onTrack = actualProgress >= (expectedProgress - 10); // 10% tolerance

    return {
        total_tasks: progress.total_tasks,
        completed_tasks: progress.completed_tasks,
        in_progress_tasks: progress.in_progress_tasks,
        pending_tasks: progress.pending_tasks,
        completion_rate: actualProgress,
        days_remaining: daysRemaining,
        on_track: onTrack,
        expected_progress: expectedProgress,
        last_updated: progress.last_updated
    };
}

function generateDashboardData() {
    const systemHealth = analyzeSystemHealth();
    const pendingFixes = analyzePendingFixes();
    const teamActivity = analyzeTeamActivity();
    const monthlyProgress = getMonthlyProgress();

    const dashboardData = {
        generated_at: new Date().toISOString(),
        system_health: systemHealth,
        pending_fixes: pendingFixes,
        team_activity: teamActivity,
        monthly_progress: monthlyProgress,
        summary: {
            overall_status: systemHealth.status === 'operational' && pendingFixes.critical === 0 ? 'healthy' : 'needs_attention',
            priority_alerts: [],
            quick_stats: {
                system_uptime: `${systemHealth.services_operational}/${systemHealth.services_total} services`,
                monthly_completion: `${monthlyProgress.completion_rate}%`,
                pending_fixes: pendingFixes.pending,
                team_velocity: teamActivity.recent_activity_count
            }
        }
    };

    // Generate priority alerts
    if (systemHealth.status === 'critical') {
        dashboardData.summary.priority_alerts.push({
            type: 'critical',
            message: 'نظام في حالة حرجة - يتطلب تدخل فوري',
            source: 'system_health'
        });
    }

    if (pendingFixes.critical > 0) {
        dashboardData.summary.priority_alerts.push({
            type: 'warning',
            message: `يوجد ${pendingFixes.critical} إصلاحات حرجة معلقة`,
            source: 'pending_fixes'
        });
    }

    if (!monthlyProgress.on_track) {
        dashboardData.summary.priority_alerts.push({
            type: 'info',
            message: `الخطة الشهرية متأخرة - ${monthlyProgress.completion_rate}% مكتمل`,
            source: 'monthly_progress'
        });
    }

    return dashboardData;
}

// Main Execution
function main() {
    console.log('🚀 Generating dashboard data...');
    
    const dashboardData = generateDashboardData();
    writeJsonFile(DASHBOARD_DATA_PATH, dashboardData);
    
    console.log('📊 Dashboard Summary:');
    console.log(`   System Health: ${dashboardData.system_health.status}`);
    console.log(`   Monthly Progress: ${dashboardData.monthly_progress.completion_rate}%`);
    console.log(`   Pending Fixes: ${dashboardData.pending_fixes.pending}`);
    console.log(`   Priority Alerts: ${dashboardData.summary.priority_alerts.length}`);
    
    console.log('✅ Dashboard data generation completed!');
}

if (require.main === module) {
    main();
}

module.exports = {
    generateDashboardData,
    analyzeSystemHealth,
    getMonthlyProgress
};