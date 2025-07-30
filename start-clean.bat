@echo off
chcp 65001 >nul
echo ========================================
echo بدء تشغيل AzizSys - نظيف ومحسن
echo ========================================

echo [1/5] تنظيف العمليات السابقة...
call kill-all-node.bat

echo.
echo [2/5] التحقق من متطلبات النظام...
where node >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Node.js متوفر
) else (
    echo ❌ Node.js غير مثبت
    pause
    exit /b 1
)

echo.
echo [3/5] التحقق من البورت 4000...
netstat -ano | findstr :4000 >nul 2>&1
if %errorlevel%==0 (
    echo ⚠️ البورت 4000 مستخدم، سيتم تحريره...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4000') do taskkill /f /pid %%a 2>nul
    timeout /t 2 /nobreak >nul
) else (
    echo ✅ البورت 4000 متاح
)

echo.
echo [4/5] بدء الخدمة...
cd external_service
start /B node server.js
echo ✅ تم تشغيل الخدمة على البورت 4000

echo.
echo [5/5] اختبار الاتصال...
timeout /t 5 /nobreak >nul
curl -s http://localhost:4000/health >nul 2>&1
if %errorlevel%==0 (
    echo ✅ الخدمة تعمل بنجاح!
    echo 🌐 افتح: http://localhost:4000
) else (
    echo ⚠️ فشل في الاتصال، تحقق من الخدمة يدوياً
)

echo.
echo ========================================
echo 🚀 النظام جاهز للاستخدام!
echo ========================================
echo 📡 الخدمة: http://localhost:4000
echo 🔧 لإيقاف الخدمة: استخدم kill-all-node.bat
echo ========================================

cd ..
pause