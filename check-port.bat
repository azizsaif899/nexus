@echo off
echo فحص البورت %1...
netstat -aon | findstr :%1
if %errorlevel% equ 0 (
    echo البورت %1 مشغول
) else (
    echo البورت %1 متاح
)