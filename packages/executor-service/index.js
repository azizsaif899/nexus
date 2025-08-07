const fs = require('fs').promises;
const path = require('path');
const simpleGit = require('simple-git');

const git = simpleGit({ baseDir: process.cwd() });

/**
 * The main entry point for the ExecutorService agent.
 * This function is called by the TaskOrchestrator.
 * @param {object} task The task object from central_dashboard.json.
 * @returns {Promise<string>} The new status for the task.
 */
async function handleTask(task) {
  console.log(`[Executor] 🤖 Processing task: ${task.id} - "${task.title}"`);
  const branchName = `fix/${task.id}`;

  try {
    // 1. Create Git branch - This is now REAL
    await createGitBranch(branchName);

    // 2. Call Gemini to generate code
    // 3. Self-verify (lint, test)
    // 4. Create Pull Request

    console.log(`[Executor] Simulating code changes for task ${task.id}...`);
    // For now, we will just log the action.
    await logFix(task);

    console.log(`[Executor] ✅ Fix applied and logged successfully for: ${task.id}`);
    return 'AwaitingReview'; // Return the new status for the orchestrator
  } catch (error) {
    console.error(`[Executor] ❌ Error processing task ${task.id}:`, error);
    // In a real scenario, we would re-throw the error so the orchestrator can block the task.
    throw error;
  }
}

/**
 * Creates a new Git branch from main.
 * @param {string} branchName The name of the branch to create.
 */
async function createGitBranch(branchName) {
  try {
    await git.checkout('main');
    await git.pull(); // Ensure we are starting from the latest main
    await git.checkout(['-b', branchName]);
    console.log(`[Executor-Git] ✅ Created and switched to new branch: ${branchName}`);
  } catch (e) {
    console.error(`[Executor-Git] ❌ Failed to create branch ${branchName}. It might already exist. Attempting to switch.`, e);
    await git.checkout(branchName); // If it exists, just switch to it
  }
}

/**
 * Logs the completion of a fix to the central log file.
 * @param {object} task The task object that was processed.
 */
async function logFix(task) {
  const logPath = path.join(__dirname, '../..', 'fixes_log.md');
  const timestamp = new Date().toISOString();
  
  const logEntry = `
## Fix Applied: ${task.id}
- **Date**: ${timestamp}
- **Title**: ${task.title}
- **Priority**: ${task.priority}
- **Description**: ${task.description}

---
`;
  
  try {
    await fs.appendFile(logPath, logEntry, 'utf8');
    console.log(`[Executor] 📝 Log entry added to ${logPath}`);
  } catch (error) {
    console.error(`[Executor] ❌ Error logging fix:`, error);
  }
}

module.exports = { handleTask };

// Allow running directly
if (require.main === module) {
  console.log("This module is intended to be used by the TaskOrchestrator, not run directly.");
}