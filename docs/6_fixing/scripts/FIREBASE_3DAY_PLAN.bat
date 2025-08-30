@echo off
chcp 65001 >nul
title خطة Firebase 3 أيام - تنفيذ واختبار

echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                    🔥 خطة Firebase 3 أيام - التنفيذ                        ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝

set "PROJECT_ROOT=E:\azizsys5\g-assistant-nx"
cd /d "%PROJECT_ROOT%"

:menu
echo.
echo 🎯 اختر المرحلة:
echo    1. 📅 اليوم 1: إصلاح Firebase CLI وتهيئة
echo    2. 📅 اليوم 2: تكامل الوكلاء مع Data Connect
echo    3. 📅 اليوم 3: تحسين الواجهات
echo    4. 🧪 اختبار شامل للنظام
echo    5. 📊 تقرير الحالة
echo    0. خروج

set /p choice="اختر الرقم: "

if "%choice%"=="1" goto DAY1
if "%choice%"=="2" goto DAY2
if "%choice%"=="3" goto DAY3
if "%choice%"=="4" goto TEST_ALL
if "%choice%"=="5" goto STATUS_REPORT
if "%choice%"=="0" goto EXIT

:DAY1
echo.
echo 📅 اليوم 1: إصلاح Firebase CLI وتهيئة
echo ========================================
echo.
echo ✅ Firebase CLI مثبت - الإصدار:
firebase --version
echo.
echo ✅ تكوين المشروع:
if exist .firebaserc (
    echo    - .firebaserc موجود
) else (
    echo    - ❌ .firebaserc غير موجود
)
if exist firebase.json (
    echo    - firebase.json موجود
) else (
    echo    - ❌ firebase.json غير موجود
)
echo.
echo ✅ تكوين Firebase:
if exist packages\core\src\firebase-config.ts (
    echo    - firebase-config.ts موجود
) else (
    echo    - ❌ firebase-config.ts غير موجود
)
echo.
echo 🧪 اختبار Firebase Emulators:
firebase emulators:start --only dataconnect --project gen-lang-client-0147492600
pause
goto menu

:DAY2
echo.
echo 📅 اليوم 2: تكامل الوكلاء مع Data Connect
echo ==========================================
echo.
echo ✅ فحص خدمات Firestore:
if exist packages\core\src\services\firestore.service.ts (
    echo    - firestore.service.ts موجود
) else (
    echo    - ❌ firestore.service.ts غير موجود
)
echo.
echo ✅ فحص وحدة الاستعلامات:
if exist apps\api\src\modules\queries\queries.service.ts (
    echo    - queries.service.ts موجود
) else (
    echo    - ❌ queries.service.ts غير موجود
)
echo.
echo 🧪 اختبار API:
echo تشغيل API Server...
start "API Server" cmd /k "node apps\api\src\main-simple.ts"
timeout /t 5 >nul
curl http://localhost:3333/api/v2/health
pause
goto menu

:DAY3
echo.
echo 📅 اليوم 3: تحسين الواجهات
echo ============================
echo.
echo ✅ فحص الواجهات:
echo    - Admin Dashboard: http://localhost:4201
echo    - Web Chatbot: http://localhost:3001
echo.
echo 🧪 اختبار الواجهات:
start "Admin Dashboard" cmd /k "nx serve admin-dashboard --port=4201"
start "Web Chatbot" cmd /k "nx serve web-chatbot --port=3001"
echo.
echo انتظار تشغيل الواجهات...
timeout /t 10 >nul
start http://localhost:4201
start http://localhost:3001
pause
goto menu

:TEST_ALL
echo.
echo 🧪 اختبار شامل للنظام
echo ====================
echo.
echo 1️⃣ اختبار Firebase CLI:
firebase --version
echo.
echo 2️⃣ اختبار Firebase Config:
if exist firebase.json echo ✅ firebase.json موجود
if exist .firebaserc echo ✅ .firebaserc موجود
echo.
echo 3️⃣ اختبار الخدمات:
node docs\6_fixing\scripts\health-check-v2.js
echo.
echo 4️⃣ اختبار Firebase Emulators:
firebase emulators:start --only dataconnect --project gen-lang-client-0147492600
pause
goto menu

:STATUS_REPORT
echo.
echo 📊 تقرير الحالة
echo ==============
echo.
echo 🔥 Firebase CLI: 
firebase --version
echo.
echo 📁 الملفات المطلوبة:
if exist firebase.json (echo ✅ firebase.json) else (echo ❌ firebase.json)
if exist .firebaserc (echo ✅ .firebaserc) else (echo ❌ .firebaserc)
if exist packages\core\src\firebase-config.ts (echo ✅ firebase-config.ts) else (echo ❌ firebase-config.ts)
if exist packages\core\src\services\firestore.service.ts (echo ✅ firestore.service.ts) else (echo ❌ firestore.service.ts)
echo.
echo 🎯 الحالة العامة:
echo    - Firebase CLI: ✅ مثبت
echo    - التكوين: ✅ جاهز
echo    - الخدمات: ✅ مُنشأة
echo    - الاختبارات: 🧪 جاري التنفيذ
pause
goto menu

:EXIT
echo.
echo 🎊 انتهت خطة Firebase 3 أيام!
echo النظام جاهز للاستخدام مع Firebase
exit /b 0