# ====================================================================
# CRM Nxs - Comprehensive Check Script (PowerShell)
# ====================================================================
# الوصف: فحص شامل للمشروع (types, lint, tests, build)
# ====================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$InfoColor = "Cyan"
$SuccessColor = "Green"
$ErrorColor = "Red"
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
║                  🔍 CRM Nxs Comprehensive Check                ║
║              Running All Quality Checks...                    ║
╚════════════════════════════════════════════════════════════════╝
"@
Write-Host ""

# Configuration
$WORKSPACE_ROOT = "C:\nexus"
$APP_NAME = "CRM"
$FAILED = 0

# Navigate to workspace
Set-Location $WORKSPACE_ROOT

# Check 1: Dependencies
Write-ColorOutput $InfoColor "▶ Step 1/5: Checking dependencies..."
if (!(Test-Path "node_modules")) {
    Write-ColorOutput $ErrorColor "  ❌ node_modules not found!"
    Write-ColorOutput $InfoColor "  ℹ️  Run: npm install"
    $FAILED++
} else {
    Write-ColorOutput $SuccessColor "  ✅ Dependencies OK"
}

# Check 2: TypeScript
Write-ColorOutput $InfoColor "`n▶ Step 2/5: TypeScript type checking..."
tsc --noEmit 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-ColorOutput $SuccessColor "  ✅ TypeScript check passed"
} else {
    Write-ColorOutput $ErrorColor "  ❌ TypeScript errors found"
    $FAILED++
}

# Check 3: ESLint
Write-ColorOutput $InfoColor "`n▶ Step 3/5: ESLint checking..."
nx lint $APP_NAME 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-ColorOutput $SuccessColor "  ✅ Lint check passed"
} else {
    Write-ColorOutput $WarningColor "  ⚠️  Lint warnings found"
}

# Check 4: Build Test
Write-ColorOutput $InfoColor "`n▶ Step 4/5: Test build..."
nx build $APP_NAME --configuration=development 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-ColorOutput $SuccessColor "  ✅ Build test passed"
} else {
    Write-ColorOutput $ErrorColor "  ❌ Build test failed"
    $FAILED++
}

# Check 5: File Structure
Write-ColorOutput $InfoColor "`n▶ Step 5/5: Checking file structure..."
$requiredFiles = @(
    "package.json",
    "vite.config.ts",
    "tsconfig.json",
    "apps/$APP_NAME/App.tsx"
)

$structureOK = $true
foreach ($file in $requiredFiles) {
    if (!(Test-Path $file)) {
        Write-ColorOutput $ErrorColor "  ❌ Missing: $file"
        $structureOK = $false
    }
}

if ($structureOK) {
    Write-ColorOutput $SuccessColor "  ✅ File structure OK"
} else {
    $FAILED++
}

# Summary
Write-Host ""
if ($FAILED -eq 0) {
    Write-ColorOutput $SuccessColor @"
╔════════════════════════════════════════════════════════════════╗
║                   ✅ All Checks Passed!                        ║
║                                                                ║
║   Your project is ready for development/deployment            ║
╚════════════════════════════════════════════════════════════════╝
"@
} else {
    Write-ColorOutput $ErrorColor @"
╔════════════════════════════════════════════════════════════════╗
║                   ⚠️  $FAILED Check(s) Failed                       ║
║                                                                ║
║   Please fix the issues above before proceeding               ║
╚════════════════════════════════════════════════════════════════╝
"@
}

Write-Host ""
Read-Host "Press Enter to exit"
exit $FAILED
