const fs = require('fs');
const path = require('path');

// Paths
const TEMPLATE_PATH = path.join(__dirname, '../doc/templates/DAILY_BOOT_TEMPLATE.md');
const OUTPUT_PATH = path.join(__dirname, '../doc/context/DAILY_BOOT.md');
const ERRORS_LOG_PATH = path.join(__dirname, '../logs/errors.log');
const STATUS_JSON_PATH = path.join(__dirname, '../status.json');
const FEATURE_FLAGS_PATH = path.join(__dirname, '../config/flags/FEATURE_FLAGS.json');
const MONTHLY_PLAN_PATH = path.join(__dirname, '../MONTHLY_PLAN.md');
const FIXES_LOG_PATH = path.join(__dirname, '../fixes_log.md');
const TEAM_SYNC_PATH = path.join(__dirname, '../doc/TEAM_SYNC.md');
const CONFIG_PATH = path.join(__dirname, '../config/daily_boot_config.json');
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
    } catch (error) {
        console.error(`Error writing JSON file ${filePath}:`, error.message);
    }
}

function getCurrentDateTime() {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].substring(0, 5);
    return { date, time };
}

// Core Functions
function checkSystemHealth() {
    const status = readJsonFile(STATUS_JSON_PATH);
    let healthStatus = 'Operational';
    let issues = [];

    if (status.service_status) {
        for (const service in status.service_status) {
            if (status.service_status[service] !== 'operational') {
                healthStatus = 'Degraded';
                issues.push(`Service ${service} is ${status.service_status[service]}`);
            }
        }
    } else {
        healthStatus = 'Unknown';
        issues.push('Service status information not available.');
    }

    const errorsLog = readTextFile(ERRORS_LOG_PATH);
    if (errorsLog.includes('ERROR') || errorsLog.includes('CRITICAL')) {
        healthStatus = 'Critical';
        issues.push('Critical errors found in logs.');
    }

    return { healthStatus, issues };
}

function getHighPriorityTasks() {
    const monthlyPlanContent = readTextFile(MONTHLY_PLAN_PATH);
    const tasks = [];
    const regex = /## 🚀 المهام ذات الأولوية القصوى \(للتضمين في DAILY_BOOT\.md\):\s*([\s\S]*?)(?=\r?\n##|\r?\n$)/;
    const match = monthlyPlanContent.match(regex);

    if (match && match[1]) {
        const taskLines = match[1].split(/\r?\n/).filter(line => line.trim().startsWith('-'));
        taskLines.forEach(line => tasks.push(line.trim()));
    }
    return tasks;
}

function getPendingFixes() {
    const fixesLogContent = readTextFile(FIXES_LOG_PATH);
    const pendingFixes = [];
    const lines = fixesLogContent.split(/\r?\n/);

    for (const line of lines) {
        if (line.includes('الحالة: معلقة') || line.includes('Status: Pending')) {
            pendingFixes.push(line.trim());
        }
    }
    return pendingFixes;
}

function initializeMonthlyProgress() {
    if (!fs.existsSync(MONTHLY_PROGRESS_PATH)) {
        const monthlyPlanContent = readTextFile(MONTHLY_PLAN_PATH);
        const progress = {
            last_updated: new Date().toISOString(),
            total_tasks: 0,
            completed_tasks: 0,
            in_progress_tasks: 0,
            pending_tasks: 0,
            tasks: []
        };

        // Extract all tasks from monthly plan
        const taskRegex = /^- (.+)$/gm;
        let match;
        while ((match = taskRegex.exec(monthlyPlanContent)) !== null) {
            progress.tasks.push({
                id: progress.tasks.length + 1,
                title: match[1].trim(),
                status: 'pending',
                created_date: new Date().toISOString().split('T')[0],
                completed_date: null
            });
        }

        progress.total_tasks = progress.tasks.length;
        progress.pending_tasks = progress.tasks.length;

        writeJsonFile(MONTHLY_PROGRESS_PATH, progress);
        console.log('Initialized monthly progress tracking');
    }
}

function updateMonthlyProgress() {
    const progress = readJsonFile(MONTHLY_PROGRESS_PATH);
    if (!progress.tasks) return progress;

    // Update counters
    progress.completed_tasks = progress.tasks.filter(t => t.status === 'completed').length;
    progress.in_progress_tasks = progress.tasks.filter(t => t.status === 'in_progress').length;
    progress.pending_tasks = progress.tasks.filter(t => t.status === 'pending').length;
    progress.last_updated = new Date().toISOString();

    writeJsonFile(MONTHLY_PROGRESS_PATH, progress);
    return progress;
}

function getMonthlyProgressSummary() {
    const progress = readJsonFile(MONTHLY_PROGRESS_PATH);
    if (!progress.total_tasks) return null;

    const completionRate = Math.round((progress.completed_tasks / progress.total_tasks) * 100);
    return {
        total: progress.total_tasks,
        completed: progress.completed_tasks,
        in_progress: progress.in_progress_tasks,
        pending: progress.pending_tasks,
        completion_rate: completionRate
    };
}

function generateBootTasks(systemHealth, highPriorityTasks, pendingFixes) {
    const tasks = [];

    // System Health Check Task
    tasks.push({
        title: 'التحقق من الصحة العامة للنظام',
        description: `حالة النظام: ${systemHealth.healthStatus}. ${systemHealth.issues.join('. ')}`,
        source: 'System Health Check',
        type: 'System Monitoring'
    });

    // High Priority Tasks from Monthly Plan
    highPriorityTasks.forEach(task => {
        tasks.push({
            title: task.replace(/^- /, ''),
            description: 'مهمة ذات أولوية قصوى من الخطة الشهرية.',
            source: 'MONTHLY_PLAN.md',
            type: 'Project Goal'
        });
    });

    // Pending Fixes Task
    if (pendingFixes.length > 0) {
        tasks.push({
            title: 'مراجعة الإصلاحات المعلقة',
            description: `يوجد ${pendingFixes.length} إصلاحات معلقة. يرجى مراجعة fixes_log.md.`,
            source: 'fixes_log.md',
            type: 'Bug Fixing'
        });
    }

    // Monthly Progress Review Task
    const progressSummary = getMonthlyProgressSummary();
    if (progressSummary) {
        tasks.push({
            title: 'مراجعة تقدم الخطة الشهرية',
            description: `التقدم: ${progressSummary.completion_rate}% (${progressSummary.completed}/${progressSummary.total} مهام مكتملة)`,
            source: 'monthly_progress.json',
            type: 'Progress Review'
        });
    }

    // Feature flags tasks
    const featureFlags = readJsonFile(FEATURE_FLAGS_PATH);
    if (featureFlags.new_ui_enabled) {
        tasks.push({
            title: 'اختبار واجهة المستخدم الجديدة (UI v3)',
            description: 'تفعيل ميزة واجهة المستخدم الجديدة يتطلب اختبارًا إضافيًا.',
            source: 'FEATURE_FLAGS.json',
            type: 'Feature Testing'
        });
    }

    return tasks;
}

function updateBootFile(tasks, systemHealth, pendingFixes) {
    let templateContent = readTextFile(TEMPLATE_PATH);
    const { date, time } = getCurrentDateTime();
    const config = readJsonFile(CONFIG_PATH);
    const progressSummary = getMonthlyProgressSummary();

    // Fill basic placeholders
    templateContent = templateContent.replace(/\{\{DATE\}\}/g, date);
    templateContent = templateContent.replace(/\{\{TIME\}\}/g, time);
    templateContent = templateContent.replace(/\{\{ENVIRONMENT\}\}/g, config.environment || 'Development');
    templateContent = templateContent.replace(/\{\{PROJECT_NAME\}\}/g, config.project_name || 'AzizSys Core');

    // Fill high priority tasks
    const highPriorityTasks = tasks.filter(task => task.type === 'Project Goal');
    templateContent = templateContent.replace(/\{\{HIGH_PRIORITY_TASK_1\}\}/g, highPriorityTasks[0] ? highPriorityTasks[0].title : 'N/A');
    templateContent = templateContent.replace(/\{\{HIGH_PRIORITY_TASK_2\}\}/g, highPriorityTasks[1] ? highPriorityTasks[1].title : 'N/A');

    // Fill status placeholders
    templateContent = templateContent.replace(/\{\{HEALTH_CHECK_STATUS\}\}/g, systemHealth.healthStatus);
    templateContent = templateContent.replace(/\{\{PENDING_FIXES_STATUS\}\}/g, 
        pendingFixes.length > 0 ? `يوجد ${pendingFixes.length} إصلاحات معلقة.` : 'لا توجد إصلاحات معلقة.');

    // Add monthly progress info
    if (progressSummary) {
        templateContent = templateContent.replace(/\{\{MONTHLY_PROGRESS\}\}/g, 
            `${progressSummary.completion_rate}% مكتمل (${progressSummary.completed}/${progressSummary.total})`);
    }

    // Add generated tasks section
    let tasksSection = '\r\n## 📋 مهام اليوم المحددة:\r\n\r\n';
    tasks.forEach((task, index) => {
        tasksSection += `${index + 1}. **${task.title}**\r\n`;
        tasksSection += `   - الوصف: ${task.description}\r\n`;
        tasksSection += `   - المصدر: ${task.source}\r\n`;
        tasksSection += `   - النوع: ${task.type}\r\n\r\n`;
    });

    const notesSectionHeader = '## 📝 الملاحظات والتوجيهات';
    const insertIndex = templateContent.indexOf(notesSectionHeader);
    if (insertIndex !== -1) {
        templateContent = templateContent.substring(0, insertIndex) + tasksSection + '\r\n' + templateContent.substring(insertIndex);
    } else {
        templateContent += tasksSection;
    }

    fs.writeFileSync(OUTPUT_PATH, templateContent, 'utf8');
    console.log(`✅ Successfully generated DAILY_BOOT.md at ${OUTPUT_PATH}`);
}

function syncTeamBoard(tasks) {
    const { date } = getCurrentDateTime();
    let teamSyncContent = readTextFile(TEAM_SYNC_PATH);
    
    teamSyncContent += `\r\n## 🗓️ ${date} - مهام جديدة:\r\n`;
    tasks.forEach(task => {
        const cleanTitle = task.title.replace(/^- /, '');
        teamSyncContent += `- **مهمة:** ${cleanTitle}\r\n`;
        teamSyncContent += `  - **الحالة:** جديدة\r\n`;
        teamSyncContent += `  - **المسؤول:** (يحدد لاحقًا)\r\n\r\n`;
    });
    
    fs.writeFileSync(TEAM_SYNC_PATH, teamSyncContent, 'utf8');
    console.log('✅ Team board synced');
}

function notifyIfNeeded(systemHealth, tasks) {
    if (systemHealth.healthStatus === 'Critical') {
        console.log('🚨 Notification: Critical system health detected!');
    }
    if (tasks.some(task => task.type === 'Bug Fixing' && task.title.includes('حرجة'))) {
        console.log('🚨 Notification: New critical bug fixing task generated!');
    }
}

// Main Execution
async function main() {
    console.log('🚀 Starting daily boot generation...');
    
    // Initialize monthly progress tracking if needed
    initializeMonthlyProgress();
    
    // Update monthly progress counters
    updateMonthlyProgress();
    
    // Generate daily boot
    const systemHealth = checkSystemHealth();
    const highPriorityTasks = getHighPriorityTasks();
    const pendingFixes = getPendingFixes();
    const generatedTasks = generateBootTasks(systemHealth, highPriorityTasks, pendingFixes);

    updateBootFile(generatedTasks, systemHealth, pendingFixes);
    syncTeamBoard(generatedTasks);
    notifyIfNeeded(systemHealth, generatedTasks);
    
    console.log('✅ Daily boot generation completed!');
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    checkSystemHealth,
    getHighPriorityTasks,
    getPendingFixes,
    getMonthlyProgressSummary,
    updateMonthlyProgress
};