const fs = require('fs').promises;
const path = require('path');
const { run: runExecutor } = require('../packages/executor-service'); // Assuming executor can be imported

const DAILY_BOOT_PATH = path.join(__dirname, '../doc/context/DAILY_BOOT.md');
const REPORTS_DIR = path.join(__dirname, '../doc/reports');

async function orchestrateTasks() {
  console.log('[Orchestrator] Starting task orchestration...');
  try {
    const bootContent = await fs.readFile(DAILY_BOOT_PATH, 'utf8');
    
    const fixPattern = /^🚨\s*FIX:\s*(.+)$/gm;
    let match;
    const fixTasks = [];

    while ((match = fixPattern.exec(bootContent)) !== null) {
      fixTasks.push(match[1].trim());
    }

    if (fixTasks.length === 0) {
      console.log('[Orchestrator] No fix tasks found for today.');
      return;
    }

    for (const taskName of fixTasks) {
      // Assuming taskName directly corresponds to a report file name (e.g., "aws-invoke-report" -> "aws-invoke-report.json")
      const reportPath = path.join(REPORTS_DIR, `${taskName}.json`);
      console.log(`[Orchestrator] Found task: "${taskName}". Triggering executor with report: ${reportPath}...`);
      
      // Pass the report path to the executor
      await runExecutor(reportPath);
    }

    console.log('[Orchestrator] All tasks have been processed.');

  } catch (error) {
    console.error('[Orchestrator] Orchestration failed:', error);
  }
}

if (require.main === module) {
  orchestrateTasks();
}
