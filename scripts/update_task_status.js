const fs = require('fs');
const path = require('path');

const MONTHLY_PROGRESS_PATH = path.join(__dirname, '../monthly_progress.json');

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

function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Error writing JSON file ${filePath}:`, error.message);
    }
}

function updateTaskStatus(taskId, newStatus) {
    const progress = readJsonFile(MONTHLY_PROGRESS_PATH);
    
    if (!progress.tasks) {
        console.error('No tasks found in monthly progress file');
        return false;
    }

    const task = progress.tasks.find(t => t.id === taskId);
    if (!task) {
        console.error(`Task with ID ${taskId} not found`);
        return false;
    }

    const oldStatus = task.status;
    task.status = newStatus;
    
    if (newStatus === 'completed' && oldStatus !== 'completed') {
        task.completed_date = new Date().toISOString().split('T')[0];
    } else if (newStatus !== 'completed') {
        task.completed_date = null;
    }

    // Update counters
    progress.completed_tasks = progress.tasks.filter(t => t.status === 'completed').length;
    progress.in_progress_tasks = progress.tasks.filter(t => t.status === 'in_progress').length;
    progress.pending_tasks = progress.tasks.filter(t => t.status === 'pending').length;
    progress.last_updated = new Date().toISOString();

    writeJsonFile(MONTHLY_PROGRESS_PATH, progress);
    
    console.log(`✅ Task "${task.title}" status updated from "${oldStatus}" to "${newStatus}"`);
    return true;
}

function listTasks() {
    const progress = readJsonFile(MONTHLY_PROGRESS_PATH);
    
    if (!progress.tasks || progress.tasks.length === 0) {
        console.log('No tasks found');
        return;
    }

    console.log('\n📋 Current Tasks:');
    console.log('================');
    
    progress.tasks.forEach(task => {
        const statusIcon = {
            'pending': '⏳',
            'in_progress': '🔄',
            'completed': '✅'
        }[task.status] || '❓';
        
        console.log(`${task.id}. ${statusIcon} ${task.title}`);
        console.log(`   Status: ${task.status}`);
        if (task.completed_date) {
            console.log(`   Completed: ${task.completed_date}`);
        }
        console.log('');
    });
    
    console.log(`📊 Summary: ${progress.completed_tasks}/${progress.total_tasks} completed (${Math.round((progress.completed_tasks/progress.total_tasks)*100)}%)`);
}

function addTask(title, description = '') {
    const progress = readJsonFile(MONTHLY_PROGRESS_PATH);
    
    if (!progress.tasks) {
        progress.tasks = [];
    }

    const newTask = {
        id: (progress.tasks.length > 0 ? Math.max(...progress.tasks.map(t => t.id)) : 0) + 1,
        title: title,
        description: description,
        status: 'pending',
        created_date: new Date().toISOString().split('T')[0],
        completed_date: null
    };

    progress.tasks.push(newTask);
    progress.total_tasks = progress.tasks.length;
    progress.pending_tasks = progress.tasks.filter(t => t.status === 'pending').length;
    progress.last_updated = new Date().toISOString();

    writeJsonFile(MONTHLY_PROGRESS_PATH, progress);
    
    console.log(`✅ New task added: "${title}" (ID: ${newTask.id})`);
    return newTask.id;
}

// Command line interface
function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'list':
            listTasks();
            break;
            
        case 'update':
            const taskId = parseInt(args[1]);
            const status = args[2];
            
            if (!taskId || !status) {
                console.error('Usage: node update_task_status.js update <task_id> <status>');
                console.error('Status options: pending, in_progress, completed');
                process.exit(1);
            }
            
            if (!['pending', 'in_progress', 'completed'].includes(status)) {
                console.error('Invalid status. Use: pending, in_progress, or completed');
                process.exit(1);
            }
            
            updateTaskStatus(taskId, status);
            break;
            
        case 'add':
            const title = args[1];
            const description = args[2] || '';
            
            if (!title) {
                console.error('Usage: node update_task_status.js add "<task_title>" [description]');
                process.exit(1);
            }
            
            addTask(title, description);
            break;
            
        default:
            console.log('AzizSys Task Status Manager');
            console.log('==========================');
            console.log('');
            console.log('Commands:');
            console.log('  list                           - List all tasks');
            console.log('  update <id> <status>          - Update task status');
            console.log('  add "<title>" [description]   - Add new task');
            console.log('');
            console.log('Status options: pending, in_progress, completed');
            console.log('');
            console.log('Examples:');
            console.log('  node update_task_status.js list');
            console.log('  node update_task_status.js update 1 completed');
            console.log('  node update_task_status.js add "Fix login bug"');
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    updateTaskStatus,
    listTasks,
    addTask
};