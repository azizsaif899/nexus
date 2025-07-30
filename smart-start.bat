@echo off
echo بدء التطبيق بطريقة ذكية...

REM فحص البورت 4000 فقط وإيقاف العمليات التي تستخدمه
echo فحص البورت 4000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :4000 ^| findstr LISTENING') do (
    echo العملية %%a تستخدم البورت 4000
    REM التحقق من أن العملية ليست مهمة قبل إيقافها
    tasklist /fi "PID eq %%a" | findstr node.exe >nul
    if !errorlevel! equ 0 (
        echo إيقاف عملية Node.js التي تستخدم البورت 4000: %%a
        taskkill /f /pid %%a
    )
)

REM انتظار قصير للتأكد من تحرير البورت
timeout /t 2 /nobreak >nul

echo الانتقال إلى مجلد الخادم...
cd external_service

echo بدء الخادم...
node server.js