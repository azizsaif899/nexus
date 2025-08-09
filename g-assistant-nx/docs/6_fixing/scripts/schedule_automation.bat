@echo off
echo 📅 إعداد الجدولة التلقائية لنظام G-Assistant NX
echo ================================================

set SCRIPT_PATH=%~dp0run_nx_automation.bat

echo 🔧 إنشاء مهمة مجدولة يومياً في الساعة 9:00 صباحاً...

schtasks /create /tn "G-Assistant-NX-Daily-Check" /tr "%SCRIPT_PATH%" /sc daily /st 09:00 /f

if %errorlevel% equ 0 (
    echo ✅ تم إنشاء المهمة المجدولة بنجاح!
    echo 📊 ستعمل يومياً في الساعة 9:00 صباحاً
    echo.
    echo 📋 لعرض المهام المجدولة:
    echo    schtasks /query /tn "G-Assistant-NX-Daily-Check"
    echo.
    echo 🗑️ لحذف المهمة المجدولة:
    echo    schtasks /delete /tn "G-Assistant-NX-Daily-Check" /f
) else (
    echo ❌ فشل في إنشاء المهمة المجدولة
    echo 💡 تأكد من تشغيل الأمر كمدير
)

pause