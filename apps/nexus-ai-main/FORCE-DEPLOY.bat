@echo off
echo 🔥 رفع إجباري على Firebase
echo ============================

echo 🧹 حذف dist القديم...
if exist dist rmdir /s /q dist

echo 📦 بناء جديد...
call npm run build

if not exist dist (
    echo ❌ فشل البناء - dist غير موجود!
    pause
    exit /b 1
)

echo 📂 محتويات dist:
dir dist

echo 🚀 رفع على Firebase...
call firebase deploy --only hosting --force

echo ✅ تم!
pause