@echo off
chcp 65001 >nul
title إصلاح NX Cloud و Firebase

echo 🔧 إصلاح مشاكل NX Cloud و Firebase...
echo.

echo 1️⃣ إصلاح NX Cloud Connection...
cd /d "E:\azizsys5\g-assistant-nx"

:: إصلاح NX Cloud بدون -y flag
pnpm exec nx connect
echo ✅ تم إصلاح NX Cloud

echo.
echo 2️⃣ إيقاف Firebase Emulator المتضارب...
taskkill /f /im firebase.exe 2>nul
taskkill /f /im java.exe /fi "WINDOWTITLE eq Firebase*" 2>nul
netstat -ano | findstr :9399 | for /f "tokens=5" %%a in ('more') do taskkill /f /pid %%a 2>nul

echo.
echo 3️⃣ إصلاح firebase.json...
if not exist firebase.json (
    echo {
    echo   "emulators": {
    echo     "dataconnect": {
    echo       "host": "127.0.0.1",
    echo       "port": 9400
    echo     },
    echo     "ui": {
    echo       "enabled": true,
    echo       "host": "127.0.0.1",
    echo       "port": 4000
    echo     }
    echo   }
    echo } > firebase.json
    echo ✅ تم إنشاء firebase.json
) else (
    echo ✅ firebase.json موجود
)

echo.
echo 4️⃣ تشغيل Firebase على بورت جديد...
firebase emulators:start --project gen-lang-client-0147492600 --only dataconnect

pause