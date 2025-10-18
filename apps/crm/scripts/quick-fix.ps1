# ====================================================================
# CRM Nxs - Quick Fix Script (PowerShell)
# ====================================================================
# الوصف: حل سريع للمشاكل الشائعة
# ====================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$InfoColor = "Cyan"
$SuccessColor = "Green"

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
║                  🔧 CRM Nxs Quick Fix Tool                     ║
║               Fixing Common Issues Automatically...           ║
╚════════════════════════════════════════════════════════════════╝
"@
Write-Host ""

$WORKSPACE_ROOT = "C:\nexus"
Set-Location $WORKSPACE_ROOT

# Fix 1: Kill processes on common ports
Write-ColorOutput $InfoColor "▶ Fix 1: Freeing ports..."
$ports = @(5173, 3000, 4200)
foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | 
               Select-Object -ExpandProperty OwningProcess -First 1
    if ($process) {
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        Write-ColorOutput $SuccessColor "  ✅ Freed port $port"
    }
}

# Fix 2: Clear Nx cache
Write-ColorOutput $InfoColor "`n▶ Fix 2: Clearing Nx cache..."
if (Test-Path ".nx") {
    Remove-Item -Recurse -Force ".nx"
    Write-ColorOutput $SuccessColor "  ✅ Cleared Nx cache"
}

# Fix 3: Clear node_modules cache
Write-ColorOutput $InfoColor "`n▶ Fix 3: Clearing node_modules cache..."
if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache"
    Write-ColorOutput $SuccessColor "  ✅ Cleared node_modules cache"
}

# Fix 4: Reset package-lock
Write-ColorOutput $InfoColor "`n▶ Fix 4: Resetting package-lock..."
if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json"
    npm install
    Write-ColorOutput $SuccessColor "  ✅ Regenerated package-lock.json"
}

# Fix 5: Clear npm cache
Write-ColorOutput $InfoColor "`n▶ Fix 5: Clearing npm cache..."
npm cache clean --force
Write-ColorOutput $SuccessColor "  ✅ Cleared npm cache"

Write-Host ""
Write-ColorOutput $SuccessColor @"
╔════════════════════════════════════════════════════════════════╗
║                   ✅ Quick Fix Complete!                       ║
║                                                                ║
║   Try running: .\scripts\start-dev.ps1                         ║
╚════════════════════════════════════════════════════════════════╝
"@
Write-Host ""
Read-Host "Press Enter to exit"
