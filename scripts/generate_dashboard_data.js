const fs = require('fs');
const path = require('path');

// Paths
const DASHBOARD_DATA_PATH = path.join(__dirname, '../doc/dashboard_data.json');
const ERRORS_LOG_PATH = path.join(__dirname, '../logs/errors.log');
const FIXES_LOG_PATH = path.join(__dirname, '../doc/process/fixes_log.md'); // Corrected path
const TEAM_SYNC_PATH = path.join(__dirname, '../doc/process/TEAM_SYNC.md'); // Corrected path
const STATUS_JSON_PATH = path.join(__dirname, '../status.json');
const MONTHLY_PROGRESS_PATH = path.join(__dirname, '../monthly_progress.json');
const DAILY_BOOT_PATH = path.join(__dirname, '../doc/context/DAILY_BOOT.md');
const MONTHLY_PLAN_PATH = path.join(__dirname, '../MONTHLY_PLAN.md'); // Assuming this is the correct path for the monthly plan

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

function analyzePendingFixes() {
    const fixesLog = readTextFile(FIXES_LOG_PATH);
    const lines = fixesLog.split('\n');
    
    let totalFixes = 0;
    let pendingFixes = 0;
    let completedFixes = 0;
    let criticalFixes = 0;
    
    lines.forEach(line => {
        if (line.includes('## ') && (line.includes('إصلاح') || line.includes('Fix'))) {
            totalFixes++;
            if (line.includes('✅') || line.includes('مكتمل') || line.includes('Completed')) {
                completedFixes++;
            } else {
                pendingFixes++;
            }
            if (line.includes('حرج') || line.includes('Critical') || line.includes('🚨')) {
                criticalFixes++;
            }
        }
    });
    
    const completionRate = totalFixes > 0 ? Math.round((completedFixes / totalFixes) * 100) : 0;
    
    return {
        total: totalFixes,
        pending: pendingFixes,
        completed: completedFixes,
        critical: criticalFixes,
        completion_rate: completionRate
    };
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

function parseTeamSync() {
    const teamSyncContent = readTextFile(TEAM_SYNC_PATH);
    const lines = teamSyncContent.split('\n');
    const tasks = [];
    let inTableSection = false;

    lines.forEach(line => {
        if (line.includes('| المساعد (Assistant)') || line.includes('| :---')) {
            inTableSection = true;
            return;
        }
        
        if (inTableSection && line.startsWith('|') && !line.includes('---')) {
            const columns = line.split('|').map(col => col.trim()).filter(col => col);
            if (columns.length >= 4) {
                const [assistant, task, files, status] = columns;
                tasks.push({
                    assistant: assistant.replace(/`/g, '').trim(),
                    description: task.trim(),
                    files: files.trim(),
                    status: status.replace(/`/g, '').trim(),
                    date: new Date().toISOString().split('T')[0]
                });
            }
        }
        
        if (line.includes('**تعليمات:**') || line.includes('---')) {
            inTableSection = false;
        }
    });
    return tasks;
}

function parseDailyBoot() {
    const dailyBootContent = readTextFile(DAILY_BOOT_PATH);
    const lines = dailyBootContent.split('\n');
    const tasks = [];
    let inPriorityTasksSection = false;

    lines.forEach(line => {
        if (line.includes('## 🎯 Priority Tasks')) {
            inPriorityTasksSection = true;
            return;
        }
        if (line.includes('## 📊 Status Overview') || line.includes('## 🔄 Next Steps')) {
            inPriorityTasksSection = false;
            return;
        }

        if (inPriorityTasksSection) {
            const taskMatch = line.match(/^\d+\. (.*?) \((المصدر: (.*?))\)/);
            if (taskMatch) {
                const description = taskMatch[1].trim();
                const source = taskMatch[3] ? taskMatch[3].trim() : 'DAILY_BOOT';
                const statusMatch = line.match(/✅|⏳|🔧/);
                let status = 'Pending';
                if (statusMatch) {
                    if (statusMatch[0] === '✅') status = 'Completed';
                    if (statusMatch[0] === '⏳') status = 'In Progress';
                    if (statusMatch[0] === '🔧') status = 'Pending'; // Assuming wrench means pending/to do
                }
                tasks.push({ description, source, status });
            }
        }
    });
    return tasks;
}

function parseMonthlyPlan() {
    const monthlyPlanContent = readTextFile(MONTHLY_PLAN_PATH);
    const lines = monthlyPlanContent.split('\n');
    const tasks = [];
    let inTasksSection = false;

    lines.forEach(line => {
        if (line.includes('## 🎯 المهام الرئيسية') || line.includes('## 📋 المهام')) { // Adjust based on actual MONTHLY_PLAN.md structure
            inTasksSection = true;
            return;
        }
        if (line.startsWith('## ') && inTasksSection) { // End of tasks section
            inTasksSection = false;
            return;
        }

        if (inTasksSection && line.startsWith('- ')) {
            const description = line.substring(2).trim();
            tasks.push({ description, source: 'Monthly Plan', status: 'Pending' });
        }
    });
    return tasks;
}

function generateDashboardData() {
    const systemHealth = analyzeSystemHealth();
    const pendingFixes = analyzePendingFixes();
    const teamSyncTasks = parseTeamSync();
    const dailyBootTasks = parseDailyBoot();
    const monthlyPlanTasks = parseMonthlyPlan();

    // Categorize tasks from Team Sync
    const completedTasks = teamSyncTasks.filter(task => 
        task.status.includes('Completed') || task.status.includes('مكتمل') || task.status.includes('✅')
    );
    const inProgressTasks = teamSyncTasks.filter(task => 
        task.status.includes('In Progress') || task.status.includes('قيد التنفيذ') || task.status.includes('🚧')
    );

    // Identify next tasks: from Monthly Plan not yet in Team Sync or Daily Boot
    const teamSyncDescriptions = new Set(teamSyncTasks.map(t => t.description));
    const dailyBootDescriptions = new Set(dailyBootTasks.map(t => t.description));
    const nextTasks = monthlyPlanTasks.filter(task => 
        !teamSyncDescriptions.has(task.description) && !dailyBootDescriptions.has(task.description)
    );

    const dashboardData = {
        generated_at: new Date().toISOString(),
        system_health: systemHealth,
        pending_fixes: pendingFixes,
        team_activity: {
            total_tasks: teamSyncTasks.length,
            in_progress_tasks: inProgressTasks.length,
            completed_tasks: completedTasks.length,
            recent_activity_count: teamSyncTasks.filter(task => {
                const taskDate = new Date(task.date);
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return taskDate >= sevenDaysAgo;
            }).length,
            task_completion_rate: teamSyncTasks.length > 0 ? Math.round((completedTasks.length / teamSyncTasks.length) * 100) : 0
        },
        monthly_progress: getMonthlyProgress(), // This function needs to be updated to use the new task parsing
        daily_report: {
            completed_today: [...completedTasks.slice(-3), ...dailyBootTasks.filter(task => task.status === 'Completed')],
            in_progress_today: [...inProgressTasks, ...dailyBootTasks.filter(task => task.status === 'In Progress')],
            next_today: [...dailyBootTasks.filter(task => task.status === 'Pending'), ...nextTasks.slice(0, 3)]
        },
        weekly_report: {
            completed_this_week: teamSyncTasks.filter(task => {
                const taskDate = new Date(task.date);
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return task.status === 'Completed' && taskDate >= sevenDaysAgo;
            }),
            in_progress_this_week: inProgressTasks, // All in-progress are current
            upcoming_this_week: nextTasks.slice(0, 5) // Top 5 upcoming from monthly plan
        },
        all_tasks: teamSyncTasks, // For a comprehensive list if needed
        summary: {
            overall_status: systemHealth.status === 'operational' && pendingFixes.critical === 0 ? 'healthy' : 'needs_attention',
            priority_alerts: [],
            quick_stats: {
                system_uptime: `${systemHealth.services_operational}/${systemHealth.services_total} services`,
                monthly_completion: `${getMonthlyProgress().completion_rate}%`,
                pending_fixes: pendingFixes.pending,
                team_velocity: teamSyncTasks.filter(task => {
                    const taskDate = new Date(task.date);
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    return taskDate >= sevenDaysAgo;
                }).length // Re-calculate recent activity based on all tasks
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

    if (!dashboardData.monthly_progress.on_track) {
        dashboardData.summary.priority_alerts.push({
            type: 'info',
            message: `الخطة الشهرية متأخرة - ${dashboardData.monthly_progress.completion_rate}% مكتمل`,
            source: 'monthly_progress'
        });
    }

    return dashboardData;
}

function getMonthlyProgress() {
    const progress = readJsonFile(MONTHLY_PROGRESS_PATH);
    const teamSyncTasks = parseTeamSync();

    const totalTasks = progress.total_tasks || teamSyncTasks.length || 0;
    const completedTasks = teamSyncTasks.filter(task => 
        task.status.includes('Completed') || task.status.includes('مكتمل') || task.status.includes('✅')
    ).length;
    const inProgressTasks = teamSyncTasks.filter(task => 
        task.status.includes('In Progress') || task.status.includes('قيد التنفيذ') || task.status.includes('🚧')
    ).length;
    const pendingTasks = Math.max(0, totalTasks - completedTasks - inProgressTasks);
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysRemaining = Math.ceil((lastDayOfMonth - now) / (1000 * 60 * 60 * 24));
    
    const expectedProgress = Math.round(((30 - daysRemaining) / 30) * 100);
    const onTrack = completionRate >= (expectedProgress - 10);

    return {
        total_tasks: totalTasks,
        completed_tasks: completedTasks,
        in_progress_tasks: inProgressTasks,
        pending_tasks: pendingTasks,
        completion_rate: completionRate,
        days_remaining: daysRemaining,
        on_track: onTrack,
        expected_progress: expectedProgress,
        last_updated: progress.last_updated || new Date().toISOString()
    };
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