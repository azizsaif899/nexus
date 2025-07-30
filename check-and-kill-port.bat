@echo off
set PORT=4000

echo فحص البورت %PORT%...
netstat -ano | findstr :%PORT%

if %errorlevel% equ 0 (
    echo البورت %PORT% مستخدم، جاري تحريره...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%PORT%') do (
        echo إيقاف العملية: %%a
        taskkill /f /pid %%a
    )
    echo تم تحرير البورت %PORT%
) else (
    echo البورت %PORT% متاح
)

echo بدء الخادم...
cd external_service
node server.js