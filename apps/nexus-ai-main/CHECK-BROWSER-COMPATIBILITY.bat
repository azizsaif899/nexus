@echo off
chcp 65001 > nul
echo.
echo ====================================
echo 🔍 فحص توافق المتصفحات
echo ====================================
echo.

cd /d "%~dp0"

echo 📋 فحص التكوين...
call npm run check:compatibility

echo.
echo ====================================
echo 📊 المتصفحات المدعومة:
echo ====================================
echo.

call npm run check:browsers

echo.
echo ====================================
echo ✅ الفحص مكتمل!
echo ====================================
echo.
echo للبناء مع التحويلات التلقائية:
echo   npm run build
echo.
echo للتطوير:
echo   npm run dev
echo.

pause
