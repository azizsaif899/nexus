@echo off
echo 🤖 إعداد نظام الإصلاح الذاتي الذكي
echo =====================================

cd /d "%~dp0\..\..\.."

echo 📦 تثبيت التبعيات المطلوبة...
cd auto-repair
call npm install

echo.
echo 🔑 إعداد مفتاح Gemini AI...
if not exist .env (
    copy .env.example .env
    echo ✅ تم إنشاء ملف .env
    echo.
    echo 💡 يرجى تحديث GEMINI_API_KEY في ملف auto-repair\.env
    echo    احصل على المفتاح من: https://makersuite.google.com/app/apikey
    echo.
) else (
    echo ⚠️ ملف .env موجود بالفعل
)

echo 🧪 اختبار النظام...
echo.
node -e "
try {
  require('./src/orchestrator.ts');
  console.log('✅ النظام جاهز للعمل');
} catch (error) {
  console.log('❌ خطأ في النظام:', error.message);
}
"

echo.
echo 📋 الخطوات التالية:
echo 1. أضف GEMINI_API_KEY في auto-repair\.env
echo 2. شغل: npm run repair:run
echo 3. افتح لوحة التحكم: npm run dashboard
echo.

pause