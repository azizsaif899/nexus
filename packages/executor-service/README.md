# Executor Service (`packages/executor-service/index.js`)

### Purpose

The Executor Service is the core component responsible for applying automated fixes and executing specific tasks as defined in fix reports. It acts as a dispatcher, delegating tasks to specialized handlers (plugins) based on the task type.

### How it Works

1.  Receives a path to a fix report (e.g., `doc/reports/fix_report_sample.json`).
2.  Reads and parses the fix report, extracting the `id`, `description`, and `task` details.
3.  Based on the `task.type` (e.g., `text-replace`, `amazon`), it dispatches the `task.payload` to the appropriate registered handler.
4.  **`text-replace` handler:** Reads a specified file, replaces `oldText` with `newText`, and writes the modified content back to the file.
5.  **`amazon` handler (plugin):** Invokes a mock Amazon API endpoint with provided parameters (in a real scenario, this would interact with AWS services).
6.  Logs the applied fix details (ID, description, file path, date) to `fixes_log.md`.

### Handlers (Plugins)

The Executor Service is designed to be extensible through a plugin system. New task types can be added by creating a new handler and registering it with the `ExecutorService` instance.

*   **`text-replace`:** Handles simple text replacement within files.
*   **`amazon` (`packages/executor-service/plugins/amazon/index.js`):** A specialized plugin for interacting with (mock) Amazon services.

### Dependencies

*   `fs.promises` (Node.js built-in for file system operations)
*   `path` (Node.js built-in for path manipulation)
*   `packages/executor-service/plugins/amazon/index.js` (Amazon Plugin)
*   `doc/reports/` (Input: Directory containing fix reports)
*   `fixes_log.md` (Output: Log of applied fixes)

### Usage

The Executor Service is typically invoked by the Task Orchestrator. It can also be run directly for testing purposes by passing a report path:

```javascript
// Example of direct usage (for testing/debugging)
const { run } = require('./index.js');
run('../../doc/reports/fix_report_sample.json');
```
