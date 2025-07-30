@echo off
echo بدء التطبيق بطريقة آمنة...

REM فحص البورت 4000 فقط
echo فحص البورت 4000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :4000 ^| findstr LISTENING') do (
    echo العملية %%a تستخدم البورت 4000، جاري إيقافها...
    taskkill /f /pid %%a
)

REM انتظار ثانية واحدة
timeout /t 1 /nobreak >nul

echo بدء الخادم على البورت 4000...
cd external_service
node server.js