@echo off
echo ========================================
echo    G-Assistant v6.0.0 - GitHub Upload
echo ========================================
echo.

echo 🚀 بدء رفع المشروع إلى GitHub...
echo.

echo 📋 معلومات المشروع:
echo    - الاسم: G-Assistant
echo    - الإصدار: 6.0.0
echo    - المؤلف: عبدالعزيز
echo    - الملفات: 565+ ملف
echo    - خطوط الكود: 61,220+ سطر
echo.

echo ⚠️  تأكد من إنشاء مستودع جديد على GitHub أولاً!
echo    1. اذهب إلى https://github.com/new
echo    2. اسم المستودع: g-assistant
echo    3. الوصف: G-Assistant: AI-Powered Strategic Assistant for Google Sheets
echo    4. اختر Public
echo    5. لا تضف README أو .gitignore أو LICENSE (موجودة بالفعل)
echo.

set /p username="🔑 أدخل اسم المستخدم على GitHub: "
if "%username%"=="" (
    echo ❌ يجب إدخال اسم المستخدم!
    pause
    exit /b 1
)

echo.
echo 🔗 إضافة remote origin...
git remote remove origin 2>nul
git remote add origin https://github.com/%username%/g-assistant.git

if %errorlevel% neq 0 (
    echo ❌ فشل في إضافة remote origin!
    pause
    exit /b 1
)

echo ✅ تم إضافة remote origin بنجاح
echo.

echo 📤 رفع المشروع إلى GitHub...
git push -u origin master

if %errorlevel% neq 0 (
    echo ❌ فشل في رفع المشروع!
    echo 💡 تأكد من:
    echo    - إنشاء المستودع على GitHub
    echo    - صحة اسم المستخدم
    echo    - تسجيل الدخول إلى Git
    echo.
    echo 🔧 لتسجيل الدخول:
    echo    git config --global user.name "اسمك"
    echo    git config --global user.email "بريدك@example.com"
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ تم رفع المشروع بنجاح!
echo ========================================
echo.
echo 🌐 رابط المستودع:
echo    https://github.com/%username%/g-assistant
echo.
echo 📚 الملفات المرفوعة:
echo    ✅ README.md - الوثائق الرئيسية
echo    ✅ CONTRIBUTING.md - دليل المساهمة
echo    ✅ LICENSE - ترخيص MIT
echo    ✅ package.json - إعدادات Node.js
echo    ✅ 565+ ملف من الكود والوثائق
echo.
echo 🎯 الخطوات التالية:
echo    1. راجع المستودع على GitHub
echo    2. أضف وصفاً مفصلاً
echo    3. أضف topics/tags للمشروع
echo    4. فعّل GitHub Pages للوثائق
echo    5. أنشئ أول Issue أو Discussion
echo.
echo 🚀 المشروع جاهز للمساهمات والتطوير!
echo.

start https://github.com/%username%/g-assistant

pause