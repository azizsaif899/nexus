@echo off
echo ========================================
echo    تشغيل نظام الأتمتة المرئية الاحترافي
echo    Visual Workflow Automation System
echo ========================================
echo.

cd /d "C:\nexus\apps\visual-automation"

echo التحقق من Node.js...
node --version
if %errorlevel% neq 0 (
    echo خطأ: Node.js غير مثبت أو غير موجود في PATH
    pause
    exit /b 1
)

echo التحقق من npm...
npm --version
if %errorlevel% neq 0 (
    echo خطأ: npm غير مثبت أو غير موجود في PATH
    pause
    exit /b 1
)

echo.
echo تثبيت المكتبات...
npm install

if %errorlevel% neq 0 (
    echo خطأ في تثبيت المكتبات
    pause
    exit /b 1
)

echo.
echo تشغيل التطبيق على المنفذ 4100...
echo افتح المتصفح على: http://localhost:4100
echo.
echo للإيقاف: اضغط Ctrl+C
echo ========================================

npm run dev

pause