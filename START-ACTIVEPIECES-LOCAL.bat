@echo off
chcp 65001 >nul
echo ═══════════════════════════════════════════════════════════
echo  🚀 Activepieces - إعداد البيئة المحلية
echo ═══════════════════════════════════════════════════════════
echo.

echo [1/5] 🔑 توليد مفاتيح التشفير...
echo.

powershell -Command ^
"$encKey = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_}); ^
$jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_}); ^
Write-Host 'AP_ENCRYPTION_KEY='$encKey -ForegroundColor Green; ^
Write-Host 'AP_JWT_SECRET='$jwtSecret -ForegroundColor Green; ^
Write-Host ''; ^
Write-Host '⚠️  احفظ هذه المفاتيح! ستحتاجها لاحقاً' -ForegroundColor Yellow; ^
Write-Host ''; ^
$confirm = Read-Host 'هل نسخت المفاتيح؟ (y/n)'; ^
if ($confirm -ne 'y') { Write-Host 'يرجى نسخ المفاتيح أولاً!' -ForegroundColor Red; exit 1; }"

if errorlevel 1 goto :error

echo.
echo [2/5] 📝 تحديث docker-compose.yml بالمفاتيح...
echo ⚠️  يرجى تحديث الملف يدوياً: docker-compose.activepieces.yml
echo    - استبدل: AP_ENCRYPTION_KEY
echo    - استبدل: AP_JWT_SECRET
echo.
pause

echo.
echo [3/5] 🐳 التحقق من Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker غير مثبت!
    echo يرجى تثبيت Docker Desktop من: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo ✅ Docker متوفر

echo.
echo [4/5] 🚀 تشغيل Activepieces + PostgreSQL...
docker-compose -f docker-compose.activepieces.yml up -d

if errorlevel 1 (
    echo ❌ فشل تشغيل Docker Compose
    goto :error
)

echo.
echo [5/5] ⏳ انتظار تجهيز الخدمات...
timeout /t 10 /nobreak >nul

echo.
echo ═══════════════════════════════════════════════════════════
echo  ✅ تم الإعداد بنجاح!
echo ═══════════════════════════════════════════════════════════
echo.
echo 📊 الخدمات المتاحة:
echo    - Activepieces: http://localhost:8080
echo    - PostgreSQL: localhost:5432
echo.
echo 🔍 التحقق من الحالة:
echo    docker-compose -f docker-compose.activepieces.yml ps
echo.
echo 📋 عرض السجلات:
echo    docker-compose -f docker-compose.activepieces.yml logs -f
echo.
echo 🛑 إيقاف الخدمات:
echo    docker-compose -f docker-compose.activepieces.yml down
echo.
echo 🗑️  إيقاف وحذف البيانات:
echo    docker-compose -f docker-compose.activepieces.yml down -v
echo.
echo ═══════════════════════════════════════════════════════════

echo.
set /p open="هل تريد فتح Activepieces في المتصفح؟ (y/n): "
if /i "%open%"=="y" (
    start http://localhost:8080
    echo ✅ تم فتح المتصفح
)

echo.
echo 📚 الخطوات التالية:
echo    1. افتح http://localhost:8080
echo    2. أنشئ حساب Admin
echo    3. ابدأ بناء أول Flow
echo    4. راجع الدليل: apps\nexus-ai-main\LOCAL-DEV-SETUP.md
echo.
pause
exit /b 0

:error
echo.
echo ❌ حدث خطأ أثناء الإعداد
echo.
echo 🔧 استكشاف الأخطاء:
echo    1. تأكد من تشغيل Docker Desktop
echo    2. تأكد من عدم استخدام المنفذ 8080 و 5432
echo    3. راجع السجلات: docker-compose -f docker-compose.activepieces.yml logs
echo.
pause
exit /b 1
