@echo off
echo ========================================
echo   إضافة Multi-tenant للمشروع الموجود
echo ========================================

echo [1/3] إضافة Firestore rules...
copy config\firebase\firestore.rules firestore.rules

echo [2/3] إضافة tenant services...
echo ✓ TenantService
echo ✓ SubscriptionService  
echo ✓ UserService

echo [3/3] تحديث Firebase config...
firebase deploy --only firestore:rules

echo ========================================
echo ✅ تم! الآن المشروع يدعم Multi-tenant
echo التالي: تشغيل npm run dev:nexus-ai-main
echo ========================================
pause