@echo off
echo 🤖 تشغيل النظام الأوتوماتيكي الكامل
echo =====================================

echo 📋 فحص المتطلبات...
if not exist "node_modules" (
    echo ❌ node_modules غير موجود
    echo 🔧 تثبيت التبعيات...
    npm install
)

echo ✅ بدء تشغيل النظام التلقائي...

echo 🤖 تشغيل Amazon Q Auto-Executor...
start "Amazon Q" cmd /k "npm run amazon-q:auto"

echo 🧠 تشغيل Gemini AI Auto-Reviewer...  
start "Gemini AI" cmd /k "npm run gemini:auto"

echo 📊 تشغيل لوحة المراقبة...
start "Monitor Dashboard" cmd /k "npm run dashboard:monitor"

echo 🔔 تشغيل نظام الإشعارات...
start "Notifications" cmd /k "npm run notifications:start"

echo ✅ النظام الأوتوماتيكي يعمل الآن!
echo 📊 لوحة المراقبة: http://localhost:3000/auto-monitor
echo 🎯 دورك الآن: مراقبة فقط!

pause