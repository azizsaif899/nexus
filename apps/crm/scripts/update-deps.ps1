# ====================================================================
# CRM Nxs - Update Dependencies Script (PowerShell)
# ====================================================================
# الوصف: تحديث التبعيات بأمان
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
║                  📦 CRM Nxs Update Dependencies                ║
║                  Updating packages safely...                  ║
╚════════════════════════════════════════════════════════════════╝
"@
Write-Host ""

$WORKSPACE_ROOT = "C:\nexus"
Set-Location $WORKSPACE_ROOT

# Backup package.json
Write-ColorOutput $InfoColor "▶ Step 1: Creating backup..."
Copy-Item "package.json" "package.json.backup"
Write-ColorOutput $SuccessColor "  ✅ Backup created: package.json.backup"

# Show outdated packages
Write-ColorOutput $InfoColor "`n▶ Step 2: Checking for outdated packages..."
npm outdated

# Ask for confirmation
Write-Host ""
Write-ColorOutput $WarningColor "⚠️  This will update packages. Continue? (y/n)"
$response = Read-Host
if ($response -ne "y" -and $response -ne "Y") {
    Write-ColorOutput $InfoColor "  ℹ️  Update cancelled"
    Remove-Item "package.json.backup"
    exit 0
}

# Update packages
Write-ColorOutput $InfoColor "`n▶ Step 3: Updating packages..."
npm update

if ($LASTEXITCODE -eq 0) {
    Write-ColorOutput $SuccessColor "  ✅ Packages updated successfully"
} else {
    Write-ColorOutput $ErrorColor "  ❌ Update failed - restoring backup"
    Copy-Item "package.json.backup" "package.json"
    Remove-Item "package.json.backup"
    exit 1
}

# Clean install
Write-ColorOutput $InfoColor "`n▶ Step 4: Clean install..."
Remove-Item -Recurse -Force "node_modules"
Remove-Item "package-lock.json"
npm install

if ($LASTEXITCODE -eq 0) {
    Write-ColorOutput $SuccessColor "  ✅ Clean install completed"
    Remove-Item "package.json.backup"
} else {
    Write-ColorOutput $ErrorColor "  ❌ Install failed - restoring backup"
    Copy-Item "package.json.backup" "package.json"
    Remove-Item "package.json.backup"
    exit 1
}

Write-Host ""
Write-ColorOutput $SuccessColor @"
╔════════════════════════════════════════════════════════════════╗
║                   ✅ Update Complete!                          ║
║                                                                ║
║   Run: .\scripts\check.ps1 to verify everything works         ║
╚════════════════════════════════════════════════════════════════╝
"@
Write-Host ""
Read-Host "Press Enter to exit"
