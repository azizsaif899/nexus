# ====================================================================
# CRM Nxs - Deep Clean Script (PowerShell)
# ====================================================================
# الوصف: تنظيف عميق لجميع الملفات المؤقتة والكاش
# الاستخدام: عندما تواجه مشاكل في البناء أو التشغيل
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
║                  🧹 CRM Nxs Deep Clean Script                  ║
║                     Cleaning Everything...                     ║
╚════════════════════════════════════════════════════════════════╝
"@
Write-Host ""

# Files and folders to clean
$itemsToClean = @(
    "node_modules",
    "node_modules/.cache",
    "node_modules/.vite",
    ".vite",
    "dist",
    "build",
    ".turbo",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml"
)

foreach ($item in $itemsToClean) {
    if (Test-Path $item) {
        Write-ColorOutput $InfoColor "  Removing: $item"
        Remove-Item -Path $item -Recurse -Force -ErrorAction SilentlyContinue
        Write-ColorOutput $SuccessColor "  ✅ Removed: $item"
    } else {
        Write-ColorOutput $WarningColor "  ⚠️  Not found: $item"
    }
}

Write-Host ""
Write-ColorOutput $InfoColor "Clearing npm cache..."
npm cache clean --force

Write-Host ""
Write-ColorOutput $SuccessColor @"
╔════════════════════════════════════════════════════════════════╗
║                   ✨ Clean Complete!                           ║
║                                                                ║
║   Next steps:                                                  ║
║   1. Run: npm install                                          ║
║   2. Run: npm run dev                                          ║
║                                                                ║
║   Or just run: .\scripts\start-dev.ps1                         ║
╚════════════════════════════════════════════════════════════════╝
"@
Write-Host ""
