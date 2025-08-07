import os
import json
import datetime
import uuid
# from google.generativeai import GenerativeModel  # سيتم تفعيله لاحقًا

def read_file(path):
    """يقرأ محتوى ملف."""
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_json(path, data):
    """يكتب البيانات إلى ملف JSON."""
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def get_next_task_from_plan(plan_content, existing_tasks):
    """
    Parses the monthly plan to find the next actionable, non-completed task.
    This is a simplified parser that creates tasks based on the plan's high-level goals.
    """
    existing_titles = {task['title'] for task in existing_tasks}

    # Define a sequence of tasks based on the monthly plan
    plan_tasks = [
        {
            "title": "بناء هيكل الـ Monorepo الاحترافي باستخدام أدوات حديثة",
            "description": "تنفيذ المرحلة 1.1 من الخطة الشهرية: بناء الأساس التقني الصلب، المؤتمت، والموجه بالمواصفات.",
            "files_to_modify": ["pnpm-workspace.yaml", "turbo.json", "package.json"],
            "acceptance_criteria": [
                "pnpm is used as the package manager.",
                "Turborepo is set up for build coordination.",
                "The monorepo folder structure is created as per `PROJECT_STRUCTURE.md`."
            ],
            "priority": "critical",
        },
        {
            "title": "فرض معايير الجودة الصارمة بشكل مركزي",
            "description": "تنفيذ المرحلة 1.2 من الخطة: إنشاء حزمة `packages/config/tsconfig` مع ملف `base.json` يفرض قواعد صارمة.",
            "files_to_modify": [
                "packages/config/tsconfig/base.json",
                "packages/config/tsconfig/package.json"
            ],
            "acceptance_criteria": [
                "The `base.json` file must contain `\"strict\": true`.",
                "Other packages should be able to extend this configuration."
            ],
            "priority": "high",
        },
        {
            "title": "توحيد تنسيق وجودة الكود عبر ESLint",
            "description": "تنفيذ المرحلة 1.2 من الخطة: إنشاء حزمة `packages/config/eslint-preset` تحتوي على إعدادات ESLint و Prettier الموحدة.",
            "files_to_modify": [
                "packages/config/eslint-preset/index.js",
                "packages/config/eslint-preset/package.json"
            ],
            "acceptance_criteria": [
                "The package provides a shareable ESLint configuration.",
                "It should include rules from a strong base like 'eslint-config-airbnb-typescript'.",
                "Other packages should be able to extend this configuration."
            ],
            "priority": "high",
        },
        {
            "title": "بناء النواة المنطقية للمنصة (core-logic)",
            "description": "تنفيذ المرحلة 2.1 من الخطة: بناء حزمة core-logic تحتوي على الخدمات الأساسية للتفاعل مع Gemini و Google APIs.",
            "files_to_modify": [
                "packages/core-logic/src/index.ts",
                "packages/core-logic/src/clients/gemini-client.ts",
                "packages/core-logic/src/clients/sheets-client.ts"
            ],
            "acceptance_criteria": [
                "The package provides a GeminiClient class to interact with the Gemini API.",
                "The package provides a SheetsClient class for Google Sheets operations.",
                "All methods must have robust error handling and JSDoc documentation."
            ],
            "priority": "critical",
        },
        {
            "title": "تفعيل أول ميزة في الشريط الجانبي: التحليل الذكي",
            "description": "استخدام `GeminiClient` من حزمة `core-logic` لتنفيذ أول حالة استخدام حقيقية. سيقوم المستخدم بتحديد نطاق في Google Sheets، وسيقوم الشريط الجانبي بإرسال البيانات إلى `GeminiClient` للحصول على تحليل نصي.",
            "files_to_modify": [
                "apps/sheets-addon/src/client/sidebar.ts",
                "apps/sheets-addon/src/server/main.ts"
            ],
            "acceptance_criteria": [
                "A button in the sidebar triggers the analysis.",
                "The client-side code correctly gets the selected range data.",
                "The server-side function calls the `GeminiClient` from the core-logic package.",
                "The analysis result from Gemini is successfully displayed back in the sidebar UI."
            ],
            "priority": "high",
        },
    ]

    # Find the first task from the plan that doesn't exist in the dashboard
    for task_def in plan_tasks:
        if task_def["title"] not in existing_titles:
            task_def["id"] = f"TASK-{uuid.uuid4().hex[:8].upper()}"
            task_def["status"] = "pending"
            task_def["created_at"] = datetime.datetime.now().isoformat()
            task_def["source"] = "MONTHLY_PLAN.md"
            return task_def

    return None

def main():
    """
    الدالة الرئيسية لإنشاء المهام اليومية.
    """
    print("Starting ProjectManagerAgent...")

    # تحديد المسارات
    project_root = "e:/azizsys5"
    monthly_plan_path = os.path.join(project_root, "MONTHLY_PLAN.md")
    dashboard_path = os.path.join(project_root, "docs/6_fixing/reports/central_dashboard.json")

    # 1. قراءة البيانات الحالية
    try:
        monthly_plan_content = read_file(monthly_plan_path)
        print("Successfully read MONTHLY_PLAN.md")
        dashboard_data = json.loads(read_file(dashboard_path))
        existing_tasks = dashboard_data.get("tasksDetails", [])
        print(f"Successfully read central_dashboard.json, found {len(existing_tasks)} existing tasks.")
    except FileNotFoundError:
        print(f"Error: {monthly_plan_path} not found.")
        return

    # 2. توليد المهمة التالية من الخطة
    new_task = get_next_task_from_plan(monthly_plan_content, existing_tasks)

    if not new_task:
        print("No new tasks to generate from the monthly plan. All planned tasks may already exist.")
        return

    print(f"Generated new task: {new_task['id']} - {new_task['title']}")

    # 3. إضافة المهمة إلى لوحة التحكم وتحديث الملخص
    dashboard_data["tasksDetails"].append(new_task)
    
    # تحديث الملخص
    summary = dashboard_data.setdefault("tasksSummary", {}).setdefault("byStatus", {})
    summary["pending"] = summary.get("pending", 0) + 1
    dashboard_data["tasksSummary"]["totalTasks"] = dashboard_data["tasksSummary"].get("totalTasks", 0) + 1

    write_json(dashboard_path, dashboard_data)
    print(f"Task {new_task['id']} added to central_dashboard.json")
    
    # Update live dashboard
    try:
        import subprocess
        subprocess.run(["python", "scripts/update_dashboard.py"], cwd="e:/azizsys5")
        print("Live dashboard updated")
    except:
        print("Could not update live dashboard")

if __name__ == "__main__":
    main()