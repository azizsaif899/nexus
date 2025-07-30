@echo off
chcp 65001 >nul
echo ========================================
echo فحص حالة البورتات - AzizSys
echo ========================================

echo البورت 4000 (الخدمة الرئيسية):
netstat -ano | findstr :4000
if %errorlevel%==0 (
    echo ✅ البورت 4000 مستخدم
) else (
    echo ❌ البورت 4000 متاح
)

echo.
echo البورت 3000:
netstat -ano | findstr :3000
if %errorlevel%==0 (
    echo ⚠️ البورت 3000 مستخدم
) else (
    echo ✅ البورت 3000 متاح
)

echo.
echo البورت 3001:
netstat -ano | findstr :3001
if %errorlevel%==0 (
    echo ⚠️ البورت 3001 مستخدم
) else (
    echo ✅ البورت 3001 متاح
)

echo.
echo البورت 3002:
netstat -ano | findstr :3002
if %errorlevel%==0 (
    echo ⚠️ البورت 3002 مستخدم
) else (
    echo ✅ البورت 3002 متاح
)

echo.
echo عمليات Node.js النشطة:
tasklist | findstr node.exe
if %errorlevel%==0 (
    echo ⚠️ هناك عمليات Node.js تعمل
) else (
    echo ✅ لا توجد عمليات Node.js
)

echo.
echo ========================================
echo انتهى الفحص
echo ========================================
pause