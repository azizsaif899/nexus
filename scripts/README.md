# Scripts Directory

This directory contains various utility scripts used to automate tasks within the project.

## Task Orchestrator (`task_orchestrator.js`)

### Purpose

The Task Orchestrator is a Node.js script responsible for reading the daily prioritized task list (`DAILY_BOOT.md`) and triggering the execution of automated fix tasks.

### How it Works

1.  Reads the content of `doc/context/DAILY_BOOT.md`.
2.  Identifies lines starting with `🚨 FIX:` which denote automated fix tasks.
3.  For each identified fix task, it constructs the path to the corresponding fix report (e.g., `doc/reports/fix_report_sample.json`).
4.  Invokes the Executor Service (`packages/executor-service/index.js`) with the path to the fix report, delegating the actual fix application.

### Dependencies

*   `fs.promises` (Node.js built-in for file system operations)
*   `path` (Node.js built-in for path manipulation)
*   `packages/executor-service/index.js` (Executor Service)
*   `doc/context/DAILY_BOOT.md` (Input: Daily task list)
*   `doc/reports/` (Input: Directory containing fix reports)

### Usage

To run the Task Orchestrator:

```bash
node scripts/task_orchestrator.js
```

It is typically run automatically after `generate_daily_boot.py` has created the `DAILY_BOOT.md` file.

## Daily Boot Generator (`generate_daily_boot.py`)

### Purpose

The Daily Boot Generator is a Python script that automates the creation of the daily prioritized task list (`DAILY_BOOT.md`). It synthesizes information from the strategic plan and real-time alerts to provide a focused daily agenda.

### How it Works

1.  Reads the `MONTHLY_PLAN.md` to identify the current strategic phase and its associated tasks.
2.  Reads `dashboard_data.json` to retrieve any critical priority alerts (e.g., detected errors, security issues).
3.  Reads `doc/AI_Amazon_Executor.md` to identify specific Amazon-related tasks.
4.  Prioritizes tasks: Critical alerts come first, followed by Amazon tasks, and then general strategic phase tasks.
5.  Generates `doc/context/DAILY_BOOT.md` with the prioritized list, formatted for clarity.

### Dependencies

*   `MONTHLY_PLAN.md` (Input: Strategic plan)
*   `dashboard_data.json` (Input: Real-time project status and alerts)
*   `doc/AI_Amazon_Executor.md` (Input: Amazon-specific task definitions)
*   `doc/templates/DAILY_BOOT_TEMPLATE.md` (Template for the daily boot file)
*   `doc/context/DAILY_BOOT.md` (Output: Generated daily task list)

### Usage

To run the Daily Boot Generator:

```bash
python scripts/generate_daily_boot.py
```

This script should be run daily, typically at the start of the workday, to provide the team with their current priorities.