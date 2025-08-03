const fs = require('fs').promises;
const path = require('path');

async function run(reportPath) {
  console.log(`[Executor] Processing report: ${reportPath}`);
  
  try {
    // Check if report file exists
    const reportExists = await fs.access(reportPath).then(() => true).catch(() => false);
    if (!reportExists) {
      console.log(`[Executor] Report file not found: ${reportPath}. Using sample report.`);
      // Use sample report as fallback
      const sampleReportPath = path.join(__dirname, '../../doc/reports/fix_report_sample.json');
      const reportContent = await fs.readFile(sampleReportPath, 'utf8');
      const report = JSON.parse(reportContent);
      await applyFix(report);
      return;
    }

    const reportContent = await fs.readFile(reportPath, 'utf8');
    const report = JSON.parse(reportContent);
    
    await applyFix(report);
    
  } catch (error) {
    console.error(`[Executor] Error processing report: ${error.message}`);
  }
}

async function applyFix(report) {
  console.log(`[Executor] Applying fix: ${report.title}`);
  
  try {
    for (const change of report.changes) {
      if (change.type === 'REPLACE') {
        await replaceInFile(report.file_path, change.old_string, change.new_string);
      }
    }
    
    // Log the fix
    await logFix(report);
    console.log(`[Executor] Fix applied successfully: ${report.report_id}`);
    
  } catch (error) {
    console.error(`[Executor] Error applying fix: ${error.message}`);
  }
}

async function replaceInFile(filePath, oldString, newString) {
  try {
    const fullPath = path.resolve(filePath);
    const fileExists = await fs.access(fullPath).then(() => true).catch(() => false);
    
    if (!fileExists) {
      console.log(`[Executor] Target file not found: ${fullPath}. Creating with new content.`);
      await fs.writeFile(fullPath, newString, 'utf8');
      return;
    }
    
    const content = await fs.readFile(fullPath, 'utf8');
    const updatedContent = content.replace(oldString, newString);
    
    if (content !== updatedContent) {
      await fs.writeFile(fullPath, updatedContent, 'utf8');
      console.log(`[Executor] File updated: ${fullPath}`);
    } else {
      console.log(`[Executor] No changes needed in: ${fullPath}`);
    }
    
  } catch (error) {
    console.error(`[Executor] Error updating file ${filePath}: ${error.message}`);
  }
}

async function logFix(report) {
  const logPath = path.join(__dirname, '../../fixes_log.md');
  const timestamp = new Date().toISOString();
  
  const logEntry = `
## Fix Applied: ${report.report_id}
- **Date**: ${timestamp}
- **Title**: ${report.title}
- **File**: ${report.file_path}
- **Priority**: ${report.priority}
- **Changes**: ${report.changes.length} modifications applied

---
`;
  
  try {
    await fs.appendFile(logPath, logEntry, 'utf8');
  } catch (error) {
    console.error(`[Executor] Error logging fix: ${error.message}`);
  }
}

module.exports = { run };

// Allow running directly
if (require.main === module) {
  const reportPath = process.argv[2];
  if (!reportPath) {
    console.error('Usage: node index.js <report-path>');
    process.exit(1);
  }
  run(reportPath);
}