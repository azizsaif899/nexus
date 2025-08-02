import datetime
import os
import json

def generate_daily_boot():
    template_path = "e:/azizsys5/doc/templates/DAILY_BOOT_TEMPLATE.md"
    output_path = "e:/azizsys5/doc/context/DAILY_BOOT.md"
    config_path = "e:/azizsys5/config/daily_boot_config.json"

    # 1. Read configuration
    config = {}
    if os.path.exists(config_path):
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
    
    environment = config.get("environment", "Development")
    project_name = config.get("project_name", "AzizSys Core")
    monthly_plan_path = config.get("monthly_plan_path", "e:/azizsys5/MONTHLY_PLAN.md")
    fixes_log_path = config.get("fixes_log_path", "e:/azizsys5/fixes_log.md")

    # 2. Read template content
    if not os.path.exists(template_path):
        print(f"Error: Template file not found at {template_path}")
        return

    with open(template_path, 'r', encoding='utf-8') as f:
        template_content = f.read()

    # Get current date and time
    now = datetime.datetime.now()
    current_date = now.strftime("%Y-%m-%d")
    current_time = now.strftime("%H:%M")

    # 3. Extract high-priority tasks from MONTHLY_PLAN.md
    high_priority_tasks = []
    if os.path.exists(monthly_plan_path):
        with open(monthly_plan_path, 'r', encoding='utf-8') as f:
            monthly_plan_content = f.read()
            # Simple parsing: look for lines under "🚀 المهام ذات الأولوية القصوى"
            # This can be made more robust with regex if needed
            lines = monthly_plan_content.split('\n')
            in_priority_section = False
            for line in lines:
                if "🚀 المهام ذات الأولوية القصوى" in line:
                    in_priority_section = True
                    continue
                if in_priority_section and line.strip().startswith('-'):
                    high_priority_tasks.append(line.strip())
                elif in_priority_section and not line.strip(): # End of section
                    break
    
    # Fill high priority tasks placeholders
    generated_content = generated_content.replace("{{HIGH_PRIORITY_TASK_1}}", high_priority_tasks[0] if len(high_priority_tasks) > 0 else "N/A")
    generated_content = generated_content.replace("{{HIGH_PRIORITY_TASK_2}}", high_priority_tasks[1] if len(high_priority_tasks) > 1 else "N/A")
    # Add more placeholders if needed, or loop through all tasks

    # 4. Check fixes_log.md for pending fixes (simple check for now)
    pending_fixes_status = "No pending fixes detected."
    if os.path.exists(fixes_log_path):
        with open(fixes_log_path, 'r', encoding='utf-8') as f:
            fixes_log_content = f.read()
            if "Pending" in fixes_log_content or "معلقة" in fixes_log_content: # Example check
                pending_fixes_status = "Pending fixes found. Review fixes_log.md."

    # Replace other placeholders
    generated_content = generated_content.replace("{{DATE}}", current_date)
    generated_content = generated_content.replace("{{TIME}}", current_time)
    generated_content = generated_content.replace("{{ENVIRONMENT}}", environment)
    generated_content = generated_content.replace("{{PROJECT_NAME}}", project_name)
    
    # Default statuses (can be updated by other scripts/processes)
    generated_content = generated_content.replace("{{HEALTH_CHECK_STATUS}}", "Pending")
    generated_content = generated_content.replace("{{TELEMETRY_STATUS}}", "Pending")
    generated_content = generated_content.replace("{{SMOKE_TEST_STATUS}}", "Pending")
    generated_content = generated_content.replace("{{GEMINI_REVIEW_STATUS}}", "Pending")
    generated_content = generated_content.replace("{{AMAZON_FIX_STATUS}}", "Pending")
    generated_content = generated_content.replace("{{BACKUP_STATUS}}", "Pending")
    generated_content = generated_content.replace("{{DYNAMIC_FEATURES_ENABLED}}", "N/A")
    
    # Add a placeholder for pending fixes status
    generated_content = generated_content.replace("{{PENDING_FIXES_STATUS}}", pending_fixes_status)


    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(generated_content)

    print(f"Successfully generated DAILY_BOOT.md at {output_path}")

if __name__ == "__main__":
    generate_daily_boot()