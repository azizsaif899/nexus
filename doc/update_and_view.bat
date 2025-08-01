@echo off
echo 🔄 تحديث بيانات المستندات...
node generate_docs_data.cjs
echo ✅ تم التحديث بنجاح!
echo 🌐 فتح عارض المستندات...
start docs_viewer.html
pause