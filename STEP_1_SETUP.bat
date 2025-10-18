@echo off
echo ========================================
echo   الخطوة 1: إعداد Firebase
echo ========================================

echo [1/4] تثبيت Firebase CLI...
npm install -g firebase-tools

echo [2/4] تسجيل الدخول...
firebase login

echo [3/4] إنشاء مشروع Firebase...
firebase init

echo [4/4] اختر الخدمات التالية:
echo ✓ Firestore
echo ✓ Functions  
echo ✓ Hosting
echo ✓ Authentication

echo ========================================
echo بعد الانتهاء، شغل: npm run setup:tenant
echo ========================================
pause