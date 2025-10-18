@echo off
echo ========================================
echo   نشر Visual Automation على nexxs.ai
echo ========================================

echo [1/4] بناء التطبيق...
cd apps\visual-automation
call npm run build

echo [2/4] إعداد Firebase hosting...
cd ..\..
firebase target:apply hosting visual-automation visual-automation

echo [3/4] نشر على Firebase...
firebase deploy --only hosting:visual-automation

echo [4/4] الحصول على URL...
echo.
echo ========================================
echo ✅ تم النشر بنجاح!
echo الرابط: https://visual-automation.nexxs.ai
echo أو: https://nexxs.ai/automation
echo ========================================
pause