# ====================================================================
# CRM Nxs - Test & Lint Script (PowerShell)
# ====================================================================
# الوصف: تشغيل الاختبارات والـ linting
# ====================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$InfoColor = "Cyan"
$SuccessColor = "Green"
$WarningColor = "Yellow"

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
║                     🧪 CRM Nxs Test Suite                      ║
║                   Running Tests & Linting...                  ║
╚════════════════════════════════════════════════════════════════╝
"@
Write-Host ""

# Configuration
$WORKSPACE_ROOT = "C:\nexus"
$APP_NAME = "CRM"

# Navigate to workspace
Set-Location $WORKSPACE_ROOT

# Run TypeScript check
Write-ColorOutput $InfoColor "▶ Step 1: TypeScript Type Check..."
tsc --noEmit

if ($LASTEXITCODE -eq 0) {
    Write-ColorOutput $SuccessColor "  ✅ TypeScript check passed"
} else {
    Write-ColorOutput $WarningColor "  ⚠️  TypeScript check found issues"
}

# Run Lint
Write-ColorOutput $InfoColor "`n▶ Step 2: ESLint Check..."
nx lint $APP_NAME

if ($LASTEXITCODE -eq 0) {
    Write-ColorOutput $SuccessColor "  ✅ Lint check passed"
} else {
    Write-ColorOutput $WarningColor "  ⚠️  Lint check found issues"
}

# Run Tests (if available)
Write-ColorOutput $InfoColor "`n▶ Step 3: Running Tests..."
nx test $APP_NAME

if ($LASTEXITCODE -eq 0) {
    Write-ColorOutput $SuccessColor "  ✅ All tests passed"
} else {
    Write-ColorOutput $WarningColor "  ⚠️  Some tests failed"
}

Write-Host ""
Write-ColorOutput $SuccessColor @"
╔════════════════════════════════════════════════════════════════╗
║                   ✅ Test Suite Complete                       ║
╚════════════════════════════════════════════════════════════════╝
"@
Write-Host ""
Read-Host "Press Enter to exit"
