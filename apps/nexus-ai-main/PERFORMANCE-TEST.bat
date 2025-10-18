@echo off
echo 🚀 اختبار الأداء - Nexus AI
echo ============================

echo 🧹 تنظيف الكاش...
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist dist rmdir /s /q dist

echo 🔧 تشغيل الخادم...
echo 📊 افتح: http://localhost:3000
echo 🔍 اختبر الأداء في DevTools

npx vite --port 3000 --host

pause