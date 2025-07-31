@echo off
chcp 65001 >nul
echo 🔄 تحديث الوثائق التلقائي - AzizSys
echo =====================================
echo.

cd /d "%~dp0"

echo 📂 المجلد الحالي: %CD%
echo.

if not exist "node.exe" (
    echo 📥 تحميل Node.js المحمول...
    powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v18.17.0/win-x64/node.exe' -OutFile 'node.exe'"
)

echo 🔄 تشغيل سكريبت التحديث...
node auto_update_docs.cjs

echo.
echo ✅ تم الانتهاء من التحديث!
echo 🌐 يمكنك الآن فتح docs_viewer.html في المتصفح
echo.
pause