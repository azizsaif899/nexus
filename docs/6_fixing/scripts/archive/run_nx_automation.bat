@echo off
chcp 65001 >nul
echo 🤖 تشغيل نظام الأتمتة لمشروع G-Assistant NX
echo ================================================

cd /d "%~dp0\..\..\.."

echo 📊 1. تشغيل مراقب المشروع...
node docs/6_fixing/scripts/nx_project_monitor.js

echo.
echo 🔧 2. تشغيل نظام الإصلاح التلقائي...
node docs/6_fixing/scripts/nx_auto_fix.js

echo.
echo 🎯 3. تشغيل منسق المهام...
node docs/6_fixing/scripts/nx_task_orchestrator.js

echo.
echo ✅ تم إكمال جميع عمليات الأتمتة!
echo 📁 التقارير محفوظة في: docs/6_fixing/reports/

pause