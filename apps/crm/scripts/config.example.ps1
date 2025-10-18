# ====================================================================
# CRM Nxs - Scripts Configuration (PowerShell)
# ====================================================================
# انسخ هذا الملف إلى config.ps1 وحدّث المسارات
# cp config.example.ps1 config.ps1
# ====================================================================

# ⚠️ مهم: حدّث هذا المسار ليطابق مسار مشروعك الفعلي
$WORKSPACE_ROOT = "C:\nexus"

# ⚠️ اسم التطبيق في Workspace
$APP_NAME = "CRM"

# المنافذ
$DEV_PORT = 5173
$PREVIEW_PORT = 4173

# تصدير المتغيرات
$global:CRM_WORKSPACE_ROOT = $WORKSPACE_ROOT
$global:CRM_APP_NAME = $APP_NAME
$global:CRM_DEV_PORT = $DEV_PORT
$global:CRM_PREVIEW_PORT = $PREVIEW_PORT

Write-Host "✅ Configuration loaded successfully!" -ForegroundColor Green
Write-Host "   Workspace: $WORKSPACE_ROOT" -ForegroundColor Cyan
Write-Host "   App: $APP_NAME" -ForegroundColor Cyan
Write-Host "   Dev Port: $DEV_PORT" -ForegroundColor Cyan
