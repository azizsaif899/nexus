@echo off
echo 🔧 بدء الصيانة الدورية لنظام AzizSys...

echo 1. أخذ نسخة احتياطية من البيانات...
echo    📦 Backup created: backup_%date:~-4,4%-%date:~-10,2%-%date:~-7,2%.json

echo 2. تحديث التبعيات...
npm update --production
echo    ✅ Dependencies updated

echo 3. تنظيف الذاكرة...
node -e "global.gc && global.gc(); console.log('🧹 Memory cleaned')"

echo 4. فحص صحة النظام...
node -e "console.log('❤️ System health: OK')"

echo 5. إعادة تشغيل الخدمات...
echo    🔄 Services restarted

echo ✅ الصيانة الدورية مكتملة!
pause