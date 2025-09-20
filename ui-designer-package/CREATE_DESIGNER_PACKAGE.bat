@echo off
echo 🎨 إنشاء حزمة مصمم الواجهات...

echo.
echo 📦 نسخ الملفات الأساسية...
copy /Y "..\package.json" "package-reference.json" >nul 2>&1
copy /Y "..\nx.json" "nx-reference.json" >nul 2>&1

echo.
echo 📁 إنشاء ملفات المشاريع...
echo {"name": "web-chatbot"} > "apps\web-chatbot\project.json"
echo {"name": "crm-system"} > "apps\crm-system\project.json"

echo.
echo 🎯 إنشاء ملفات أساسية للمكونات...
echo // UI Components > "packages\ui-components\index.ts"
echo // Design System > "packages\design-system\index.ts"

echo.
echo 📋 إنشاء ملفات التوثيق...
echo # مواصفات التصميم > "docs\design-specs\README.md"

echo.
echo ✅ تم إنشاء حزمة المصمم بنجاح!
echo.
echo 📂 المسار: ui-designer-package\
echo 📖 اقرأ: README_DESIGNER.md
echo.
pause