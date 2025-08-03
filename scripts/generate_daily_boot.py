import datetime
import os
import json
import re

def get_current_phase_and_tasks(plan_content):
    """Parses the plan to find the current phase marked as 'In Progress' and its tasks."""
    phase_name = ""
    tasks = []
    found_in_progress_line = False

    for line in plan_content.splitlines():
        line = line.strip()
        if line.startswith('🎯'):
            phase_name = line.replace('🎯', '').strip()
        
        if "In Progress" in line:
            found_in_progress_line = True
            # Extract tasks from the markdown table cell
            # Assumes tasks are in the third column (index 2) of the table
            parts = line.split('|')
            if len(parts) > 3: # Ensure there are enough columns
                tasks_md = parts[3].strip() # Get the content of the third column
                tasks = [task.strip() for task in re.findall(r'-+\s*(.*?)(?=<br>|-|$)', tasks_md)]
                break # Found the line and extracted tasks, so exit loop

    if found_in_progress_line:
        return phase_name, tasks
    return "No phase 'In Progress'.", []

def get_amazon_tasks(amazon_executor_content):
    """Extracts Amazon-related tasks from the AI_Amazon_Executor.md document."""
    amazon_tasks = []
    for line in amazon_executor_content.splitlines():
        line = line.strip()
        if line.startswith('- Amazon task:') or line.startswith('- AWS task:'):
            task_description = line.split(':', 1)[1].strip()
            amazon_tasks.append(f"🚨 FIX: {task_description}") # Format as a fix task
        elif line.startswith('* Amazon task:') or line.startswith('* AWS task:'):
            task_description = line.split(':', 1)[1].strip()
            amazon_tasks.append(f"🚨 FIX: {task_description}") # Format as a fix task
    return amazon_tasks

def generate_daily_boot():
    # --- Configuration ---
    config = {
        "monthly_plan_path": "e:/azizsys5/MONTHLY_PLAN.md",
        "dashboard_path": "e:/azizsys5/dashboard_data.json",
        "amazon_executor_path": "e:/azizsys5/doc/AI_Amazon_Executor.md", # New config entry
        "output_path": "e:/azizsys5/doc/context/DAILY_BOOT.md",
        "template_path": "e:/azizsys5/doc/templates/DAILY_BOOT_TEMPLATE.md"
    }

    # --- Read Source Files ---
    try:
        with open(config["monthly_plan_path"], 'r', encoding='utf-8') as f:
            plan_content = f.read()
        with open(config["dashboard_path"], 'r', encoding='utf-8') as f:
            dashboard_data = json.load(f)
        with open(config["amazon_executor_path"], 'r', encoding='utf-8') as f: # Read Amazon Executor doc
            amazon_executor_content = f.read()
        with open(config["template_path"], 'r', encoding='utf-8') as f:
            template_content = f.read()
    except FileNotFoundError as e:
        print(f"Error: Could not find a source file: {e.filename}")
        return

    # --- Analyze and Prioritize ---
    critical_alerts = dashboard_data.get("summary", {}).get("priority_alerts", [])
    current_phase, phase_tasks = get_current_phase_and_tasks(plan_content)
    amazon_tasks = get_amazon_tasks(amazon_executor_content) # Get Amazon tasks

    # Combine and prioritize tasks
    prioritized_tasks = []
    if critical_alerts:
        prioritized_tasks.extend([f"🚨 FIX: {alert}" for alert in critical_alerts])
    # Add Amazon tasks after critical alerts, before general phase tasks
    if amazon_tasks:
        prioritized_tasks.extend(amazon_tasks)
    if phase_tasks:
        prioritized_tasks.extend([f"- {task}" for task in phase_tasks])

    # --- Generate Content ---
    now = datetime.datetime.now()
    replacements = {
        "{{DATE}}": now.strftime("%Y-%m-%d"),
        "{{TIME}}": now.strftime("%H:%M"),
        "{{PROJECT_NAME}}": "G-Assistant Strategic Execution",
        "{{MAIN_GOAL}}": f"Execute tasks for: {current_phase}",
        "{{TASK_LIST}}": '\n'.join(prioritized_tasks) if prioritized_tasks else "- No priority tasks identified. Review plan.",
        "{{GEMINI_REVIEW_STATUS}}": "Pending",
        "{{AMAZON_FIX_STATUS}}": "Pending"
    }

    generated_content = template_content
    for key, value in replacements.items():
        generated_content = generated_content.replace(key, str(value))

    # --- Write Output ---
    with open(config["output_path"], 'w', encoding='utf-8') as f:
        f.write(generated_content)

    print(f"Successfully generated DAILY_BOOT.md at {config['output_path']}")

if __name__ == "__main__":
    generate_daily_boot()
