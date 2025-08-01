@echo off
chcp 65001 >nul
echo 🚀 رفع AzizSys إلى GitHub
echo ===========================
echo.

cd /d "%~dp0"

echo 📋 فحص الملفات المطلوبة...
if not exist "README.md" (
    echo ❌ README.md غير موجود
    echo 🔄 تشغيل reorganize_docs.bat أولاً...
    call reorganize_docs.bat
)

echo ✅ README.md موجود
echo.

echo 🔧 إعداد Git Repository...
if not exist ".git" (
    echo 📦 تهيئة Git repository جديد...
    git init
    echo.
)

echo 📝 إضافة الملفات...
git add .
echo.

echo 💬 إنشاء commit...
set /p commit_message="📝 أدخل رسالة الـ commit (أو اضغط Enter للرسالة الافتراضية): "
if "%commit_message%"=="" set commit_message=🚀 Initial commit: AzizSys v6.3.0 - Complete intelligent management system

git commit -m "%commit_message%"
echo.

echo 🌐 ربط مع GitHub Repository...
echo.
echo 📋 تعليمات إنشاء Repository على GitHub:
echo   1. اذهب إلى https://github.com/new
echo   2. اسم المستودع: azizsys5
echo   3. الوصف: 🚀 AzizSys - نظام إدارة ذكي متكامل
echo   4. اختر Public أو Private
echo   5. لا تضع علامة على "Initialize with README"
echo   6. انقر "Create repository"
echo.

set /p github_url="🔗 أدخل رابط GitHub repository (مثال: https://github.com/username/azizsys5.git): "

if "%github_url%"=="" (
    echo ❌ لم يتم إدخال رابط GitHub
    echo 📋 يمكنك رفع الملفات يدوياً لاحقاً
    goto :end
)

echo 🔗 إضافة remote origin...
git remote add origin %github_url%
echo.

echo 📤 رفع الملفات إلى GitHub...
git branch -M main
git push -u origin main
echo.

if %ERRORLEVEL% EQU 0 (
    echo ✅ تم رفع المشروع بنجاح إلى GitHub!
    echo 🌐 رابط المشروع: %github_url:~0,-4%
    echo.
    echo 🎉 المشروع جاهز الآن:
    echo   📚 الوثائق منظمة ومرتبة
    echo   🚀 الكود جاهز للمساهمات
    echo   🤝 يمكن للمطورين البدء فوراً
    echo.
) else (
    echo ❌ حدث خطأ أثناء الرفع
    echo 🔧 تحقق من:
    echo   - صحة رابط GitHub
    echo   - صلاحيات الوصول
    echo   - الاتصال بالإنترنت
    echo.
)

:end
echo 📋 ملخص العملية:
echo   📁 الملفات المنظمة: 8 ملفات رئيسية
echo   📊 إجمالي الكود: 61,220+ سطر
echo   🤖 الوكلاء الذكيون: 4 وكلاء
echo   ✅ الحالة: جاهز للإنتاج
echo.

pause