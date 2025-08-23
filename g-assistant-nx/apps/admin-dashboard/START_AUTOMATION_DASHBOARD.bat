@echo off
echo 🚀 تشغيل لوحة التحكم الأوتوماتيكية
echo =====================================

echo 📋 فحص المتطلبات...
cd /d "E:\azizsys5\g-assistant-nx"

echo 🔧 تشغيل API Server...
start "API Server" cmd /k "cd apps\api && npm run start:dev"

echo ⏳ انتظار تشغيل API...
timeout /t 5 /nobreak > nul

echo 🎛️ تشغيل Admin Dashboard...
start "Admin Dashboard" cmd /k "cd apps\admin-dashboard && npm run start"

echo ⏳ انتظار تشغيل Dashboard...
timeout /t 3 /nobreak > nul

echo 🌐 فتح المتصفح...
start http://localhost:4200/automation

echo ✅ النظام جاهز!
echo 📊 لوحة التحكم: http://localhost:4200/automation
echo 📋 التقارير: http://localhost:4200/reports  
echo 📈 المراقبة: http://localhost:4200/monitoring

pause