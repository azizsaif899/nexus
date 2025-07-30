@echo off
echo 🚀 نشر سريع للواجهة المحسنة...

REM نسخ الدوال المطلوبة
copy launch_ui.js src\
copy 30_tools\9_tools_hybrid_functions.js src\

echo ✅ تم النسخ
echo 📋 الخطوات التالية:
echo 1. افتح Google Apps Script
echo 2. انسخ محتوى launch_ui.js
echo 3. شغل showEnhancedSidebar()
echo 4. اختبر الواجهة المحسنة

pause