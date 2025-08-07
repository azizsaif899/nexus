const fs = require('fs').promises;
const path = require('path');
const { handleTask: handleExecutorTask } = require('../packages/executor-service');
const { handleTask: handleReviewerTask } = require('../packages/reviewer-service');

const DASHBOARD_PATH = path.join(__dirname, '../central_dashboard.json');

/**
 * Reads the central dashboard file.
 * @returns {Promise<object>} The parsed dashboard data.
 */
async function readDashboard() {
    try {
        const data = await fs.readFile(DASHBOARD_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`[Orchestrator] ❌ Error reading dashboard at ${DASHBOARD_PATH}:`, error);
        throw error;
    }
}

/**
 * Writes data back to the central dashboard file.
 * @param {object} data The data to write.
 */
async function writeDashboard(data) {
    try {
        await fs.writeFile(DASHBOARD_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`[Orchestrator] ❌ Error writing to dashboard at ${DASHBOARD_PATH}:`, error);
        throw error;
    }
}

/**
 * The main orchestration loop.
 */
async function orchestrate() {
    console.log('[Orchestrator] 🔄 ciclo de orquestación continuo iniciado...');

    while (true) { // Loop continuously until the queue is empty
        let dashboard = await readDashboard();

        const taskToProcess = dashboard.tasks.find(task =>
            task.status === 'Pending' ||
            task.status === 'AwaitingReview' ||
            task.status === 'ChangesRequested'
        );

        if (!taskToProcess) {
            console.log('[Orchestrator] ✅ No tasks require action. Queue is empty. Exiting.');
            break; // Exit the loop
        }

        console.log(`[Orchestrator] ▶️ Found task to process: ${taskToProcess.id} with status: ${taskToProcess.status}`);

        let newStatus;
        try {
            if (taskToProcess.status === 'Pending' || taskToProcess.status === 'ChangesRequested') {
                taskToProcess.status = 'InProgress';
                await writeDashboard(dashboard);
                newStatus = await handleExecutorTask(taskToProcess);
            } else if (taskToProcess.status === 'AwaitingReview') {
                taskToProcess.status = 'InReview';
                await writeDashboard(dashboard);
                newStatus = await handleReviewerTask(taskToProcess);
            }

            const finalDashboard = await readDashboard();
            const taskToUpdate = finalDashboard.tasks.find(t => t.id === taskToProcess.id);
            if (taskToUpdate) {
                taskToUpdate.status = newStatus;
                await writeDashboard(finalDashboard);
                console.log(`[Orchestrator] ✅ Task ${taskToUpdate.id} updated to status: ${newStatus}`);
            }
        } catch (error) {
            console.error(`[Orchestrator] 💥 Failed to process task ${taskToProcess.id}:`, error);
            const errorDashboard = await readDashboard();
            const taskToBlock = errorDashboard.tasks.find(t => t.id === taskToProcess.id);
            if (taskToBlock) {
                taskToBlock.status = 'Blocked';
                await writeDashboard(errorDashboard);
                console.log(`[Orchestrator] 🛑 Task ${taskToBlock.id} has been blocked due to an error.`);
            }
        }
        console.log(`[Orchestrator] --- Task ${taskToProcess.id} cycle finished. Looking for next task... ---`);
    }
}

if (require.main === module) {
    orchestrate().catch(error => {
        console.error("A fatal error occurred in the orchestrator:", error);
        process.exit(1);
    });
}
