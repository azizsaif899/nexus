@echo off
chcp 65001 >nul
echo ========================================
echo إيقاف جميع عمليات Node.js
echo ========================================

echo [1/4] فحص العمليات الحالية...
tasklist | findstr node.exe >nul 2>&1
if %errorlevel%==0 (
    echo ✅ تم العثور على عمليات Node.js
    tasklist | findstr node.exe
) else (
    echo ℹ️ لا توجد عمليات Node.js تعمل
    goto :end
)

echo.
echo [2/4] إيقاف العمليات بالقوة...
taskkill /f /im node.exe 2>nul
if %errorlevel%==0 (
    echo ✅ تم إيقاف العمليات بنجاح
) else (
    echo ⚠️ فشل في إيقاف بعض العمليات
)

echo.
echo [3/4] تحرير البورتات المحجوزة...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :2024') do taskkill /f /pid %%a 2>nul

echo.
echo [4/4] التحقق النهائي...
timeout /t 2 /nobreak >nul
tasklist | findstr node.exe >nul 2>&1
if %errorlevel%==0 (
    echo ⚠️ لا تزال هناك عمليات Node.js تعمل
    echo قد تحتاج لإعادة تشغيل الكمبيوتر
) else (
    echo ✅ تم تنظيف جميع العمليات بنجاح
)

:end
echo ========================================
echo تم الانتهاء من التنظيف
echo ========================================
pause