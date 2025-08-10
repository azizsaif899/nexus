@echo off
echo ========================================
echo    تنظيف المستندات القديمة
echo ========================================
echo.

echo تم دمج جميع المعلومات المهمة في:
echo - g-assistant-nx\docs\CONSOLIDATED_KNOWLEDGE_BASE.md
echo - g-assistant-nx\docs\BEST_PRACTICES_AND_TIPS.md  
echo - g-assistant-nx\docs\PROJECT_HISTORY_AND_INSIGHTS.md
echo - g-assistant-nx\docs\UNIFIED_DOCUMENTATION_INDEX.md
echo.

echo المجلدات المرشحة للحذف:
echo 1. g-assistant\docs (تم دمج محتواها)
echo 2. updated_docs - نسخة (تم استخراج المعلومات المهمة)
echo 3. docs\6_fixing\protocols (تم نقل المحتوى)
echo.

set /p confirm="هل تريد المتابعة مع الحذف؟ (y/N): "
if /i "%confirm%" NEQ "y" (
    echo تم إلغاء العملية.
    pause
    exit /b
)

echo.
echo إنشاء نسخة احتياطية أولاً...
if not exist "backup_before_cleanup" mkdir "backup_before_cleanup"

echo نسخ g-assistant\docs...
if exist "g-assistant\docs" (
    xcopy "g-assistant\docs" "backup_before_cleanup\g-assistant-docs" /E /I /H /Y
    echo ✓ تم نسخ g-assistant\docs
)

echo نسخ updated_docs...
if exist "updated_docs - نسخة" (
    xcopy "updated_docs - نسخة" "backup_before_cleanup\updated_docs" /E /I /H /Y
    echo ✓ تم نسخ updated_docs
)

echo نسخ docs\6_fixing...
if exist "docs\6_fixing" (
    xcopy "docs\6_fixing" "backup_before_cleanup\docs-6_fixing" /E /I /H /Y
    echo ✓ تم نسخ docs\6_fixing
)

echo.
echo النسخ الاحتياطية جاهزة في: backup_before_cleanup\
echo.

set /p final_confirm="تأكيد نهائي للحذف؟ (y/N): "
if /i "%final_confirm%" NEQ "y" (
    echo تم إلغاء العملية. النسخ الاحتياطية متوفرة.
    pause
    exit /b
)

echo.
echo بدء عملية الحذف...

if exist "g-assistant\docs" (
    rmdir /s /q "g-assistant\docs"
    echo ✓ تم حذف g-assistant\docs
)

if exist "updated_docs - نسخة" (
    rmdir /s /q "updated_docs - نسخة"
    echo ✓ تم حذف updated_docs - نسخة
)

if exist "docs\6_fixing" (
    rmdir /s /q "docs\6_fixing"
    echo ✓ تم حذف docs\6_fixing
)

echo.
echo ========================================
echo تم تنظيف المستندات بنجاح!
echo ========================================
echo.
echo المعلومات المهمة متوفرة الآن في:
echo g-assistant-nx\docs\
echo.
echo النسخ الاحتياطية في: backup_before_cleanup\
echo.
echo يمكنك حذف مجلد backup_before_cleanup بعد التأكد من عمل كل شيء.
echo.
pause