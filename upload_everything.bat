@echo off
echo 🔍 فحص حالة Git...
git status

echo.
echo 📝 إضافة جميع الملفات والتعديلات...
git add .

echo.
echo 💾 حفظ جميع التغييرات...
git commit -m "تحديث شامل: تعديلات محلية + خارجية + ملفات منسوخة"

echo.
echo 🌐 رفع كل شيء لـ GitHub...
git push origin master

echo.
echo ✅ تم رفع جميع التعديلات بنجاح!
echo 📊 تحقق من: https://github.com/azizsaif899/g-assistant
pause