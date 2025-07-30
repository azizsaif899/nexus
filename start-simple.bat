@echo off
echo بدء الخادم...

REM إيقاف العمليات التي تستخدم البورت 4000 فقط
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr :4000') do taskkill /f /pid %%a 2>nul

REM بدء الخادم
cd external_service
node server.js