# ====================================================================
# CRM Nxs - Production Build Script (PowerShell)
# ====================================================================
# الوصف: بناء التطبيق للإنتاج مع التحسينات
# ====================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$InfoColor = "Cyan"
$SuccessColor = "Green"
$ErrorColor = "Red"

function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Clear-Host
Write-ColorOutput $InfoColor @"
╔════════════════════════════════════════════════════════════════╗
║                  📦 CRM Nxs Production Build                   ║
║                      Building for Production...                ║
╚════════════════════════════════════════════════════════════════╝
"@
Write-Host ""

# Configuration
$WORKSPACE_ROOT = "C:\nexus"
$APP_NAME = "CRM"

# Navigate to workspace
Write-ColorOutput $InfoColor "▶ Navigating to workspace..."
Set-Location $WORKSPACE_ROOT

# Clean previous builds
Write-ColorOutput $InfoColor "`n▶ Cleaning previous builds..."
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-ColorOutput $SuccessColor "  ✅ Cleaned dist folder"
}

# Build the application
Write-ColorOutput $InfoColor "`n▶ Building application..."
nx build $APP_NAME --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-ColorOutput $SuccessColor @"
╔════════════════════════════════════════════════════════════════╗
║                   ✅ Build Successful!                         ║
║                                                                ║
║   Output: dist/apps/$APP_NAME                                  ║
║   Ready for deployment                                        ║
╚════════════════════════════════════════════════════════════════╝
"@
} else {
    Write-Host ""
    Write-ColorOutput $ErrorColor @"
╔════════════════════════════════════════════════════════════════╗
║                   ❌ Build Failed!                             ║
║                                                                ║
║   Check the error messages above                              ║
╚════════════════════════════════════════════════════════════════╝
"@
    exit 1
}

Write-Host ""
Read-Host "Press Enter to exit"
