# ====================================================================
# CRM Nxs - Preview Production Build (PowerShell)
# ====================================================================
# الوصف: معاينة البناء الإنتاجي محلياً
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
║                  👁️  CRM Nxs Preview Mode                      ║
║               Previewing Production Build...                  ║
╚════════════════════════════════════════════════════════════════╝
"@
Write-Host ""

# Configuration
$WORKSPACE_ROOT = "C:\nexus"
$APP_NAME = "CRM"
$PORT = 4173

# Navigate to workspace
Set-Location $WORKSPACE_ROOT

# Check if build exists
Write-ColorOutput $InfoColor "▶ Checking for production build..."
if (!(Test-Path "dist/apps/$APP_NAME")) {
    Write-ColorOutput $ErrorColor "  ❌ Production build not found!"
    Write-ColorOutput $InfoColor "  ℹ️  Run: .\scripts\build.ps1 first"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-ColorOutput $SuccessColor "  ✅ Production build found"

# Start preview server
Write-ColorOutput $InfoColor "`n▶ Starting preview server on port $PORT..."
Write-Host ""
Write-ColorOutput $SuccessColor @"
╔════════════════════════════════════════════════════════════════╗
║                   🎉 Preview Server Starting...                ║
║                                                                ║
║   Local:   http://localhost:$PORT                              ║
║   Testing: Production build preview                           ║
║                                                                ║
║   Press Ctrl+C to stop                                        ║
╚════════════════════════════════════════════════════════════════╝
"@
Write-Host ""

# Open browser
Start-Sleep -Seconds 2
Start-Process "http://localhost:$PORT"
Write-ColorOutput $SuccessColor "  ✅ Browser opened"
Write-Host ""

# Start preview (Nx preview command)
nx run $APP_NAME:preview
