@echo off
chcp 65001 >nul
title 🔧 ورشة الإصلاح الذاتي - Amazon Q & Gemini AI

echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                    🔧 ورشة الإصلاح الذاتي v2.0                             ║
echo ║                   Amazon Q Developer + Gemini AI                            ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝

set "PROJECT_ROOT=E:\azizsys5\g-assistant-nx"
cd /d "%PROJECT_ROOT%"

:menu
echo.
echo 🎯 اختر عملية الإصلاح:
echo    1. 🔍 فحص الصحة الشامل
echo    2. 🔧 إصلاح API Endpoints المفقودة
echo    3. 🧠 إنشاء Gemini Backend
echo    4. 🚀 تشغيل جميع الخدمات
echo    5. 🔄 الإصلاح الشامل (الكل)
echo    6. 📊 عرض التقرير النهائي
echo    0. خروج

set /p choice="اختر الرقم: "

if "%choice%"=="1" (
    echo 🔍 تشغيل فحص الصحة...
    node docs\6_fixing\scripts\health-check-v2.js
    pause
    goto menu
)

if "%choice%"=="2" (
    echo 🔧 إصلاح API Endpoints...
    node docs\6_fixing\scripts\FIX_MISSING_ENDPOINTS.js
    pause
    goto menu
)

if "%choice%"=="3" (
    echo 🧠 إنشاء Gemini Backend...
    node docs\6_fixing\scripts\CREATE_GEMINI_BACKEND.js
    pause
    goto menu
)

if "%choice%"=="4" (
    echo 🚀 تشغيل جميع الخدمات...
    call docs\6_fixing\scripts\START_ALL_SERVICES.bat
    goto menu
)

if "%choice%"=="5" (
    echo 🔄 بدء الإصلاح الشامل...
    echo.
    echo 🔧 المرحلة 1: إصلاح API Endpoints...
    node docs\6_fixing\scripts\FIX_MISSING_ENDPOINTS.js
    echo.
    echo 🧠 المرحلة 2: إنشاء Gemini Backend...
    node docs\6_fixing\scripts\CREATE_GEMINI_BACKEND.js
    echo.
    echo 🚀 المرحلة 3: تشغيل الخدمات...
    call docs\6_fixing\scripts\START_ALL_SERVICES.bat
    echo.
    echo ✅ اكتمل الإصلاح الشامل!
    goto menu
)

if "%choice%"=="6" (
    echo 📊 عرض التقرير النهائي...
    if exist "docs\6_fixing\reports\health_check_v2.json" (
        type docs\6_fixing\reports\health_check_v2.json
    ) else (
        echo ⚠️ لا يوجد تقرير - شغل فحص الصحة أولاً
    )
    pause
    goto menu
)

if "%choice%"=="0" (
    echo 👋 انتهت ورشة الإصلاح الذاتي!
    exit /b 0
)

echo ❌ اختيار غير صحيح
goto menu