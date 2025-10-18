# ====================================================================
# CRM Nxs - Project Info Script (PowerShell)
# ====================================================================
# الوصف: عرض معلومات شاملة عن المشروع
# ====================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$InfoColor = "Cyan"
$SuccessColor = "Green"
$YellowColor = "Yellow"

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
║                  📊 CRM Nxs Project Information                ║
╚════════════════════════════════════════════════════════════════╝
"@
Write-Host ""

# System Information
Write-ColorOutput $YellowColor "=== System Information ==="
Write-Host ""
Write-Host "  🖥️  OS: $([System.Environment]::OSVersion.VersionString)"
Write-Host "  📦 Node.js: $(node --version)"
Write-Host "  📦 npm: v$(npm --version)"
Write-Host "  📦 PowerShell: $($PSVersionTable.PSVersion)"

# Project Structure
Write-Host ""
Write-ColorOutput $YellowColor "=== Project Structure ==="
Write-Host ""
Write-Host "  📁 Workspace Root: C:\nexus"
Write-Host "  📁 CRM App: C:\nexus\apps\CRM"
Write-Host "  📁 Scripts: C:\nexus\scripts"

# File Counts
Write-Host ""
Write-ColorOutput $YellowColor "=== Project Statistics ==="
Write-Host ""

$tsxFiles = (Get-ChildItem -Path "apps\CRM" -Filter "*.tsx" -Recurse -ErrorAction SilentlyContinue).Count
$tsFiles = (Get-ChildItem -Path "apps\CRM" -Filter "*.ts" -Recurse -ErrorAction SilentlyContinue).Count
$cssFiles = (Get-ChildItem -Path "apps\CRM" -Filter "*.css" -Recurse -ErrorAction SilentlyContinue).Count

Write-Host "  📄 TSX Files: $tsxFiles"
Write-Host "  📄 TS Files: $tsFiles"
Write-Host "  🎨 CSS Files: $cssFiles"

# Dependencies
Write-Host ""
Write-ColorOutput $YellowColor "=== Key Dependencies ==="
Write-Host ""

if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    
    if ($packageJson.dependencies) {
        Write-Host "  📦 React: $($packageJson.dependencies.react -replace '[^0-9.]', '')"
        Write-Host "  📦 TypeScript: $($packageJson.devDependencies.typescript -replace '[^0-9.]', '')"
        Write-Host "  📦 Vite: $($packageJson.devDependencies.vite -replace '[^0-9.]', '')"
        Write-Host "  📦 Tailwind: $($packageJson.devDependencies.tailwindcss -replace '[^0-9.]', '')"
    }
}

# Git Information
Write-Host ""
Write-ColorOutput $YellowColor "=== Git Information ==="
Write-Host ""

$gitBranch = git branch --show-current 2>$null
$gitCommits = git rev-list --count HEAD 2>$null

if ($gitBranch) {
    Write-Host "  🌿 Current Branch: $gitBranch"
    Write-Host "  📝 Total Commits: $gitCommits"
} else {
    Write-Host "  ℹ️  Not a git repository"
}

# Available Scripts
Write-Host ""
Write-ColorOutput $YellowColor "=== Available Scripts ==="
Write-Host ""
Write-Host "  🚀 start-dev.ps1    - Start development server"
Write-Host "  🧹 clean.ps1        - Deep clean cache and temp files"
Write-Host "  📦 build.ps1        - Build for production"
Write-Host "  🧪 test.ps1         - Run tests and linting"
Write-Host "  📊 info.ps1         - Show this information"

Write-Host ""
Write-ColorOutput $SuccessColor @"
╔════════════════════════════════════════════════════════════════╗
║                   ✅ Information Complete                      ║
╚════════════════════════════════════════════════════════════════╝
"@
Write-Host ""
Read-Host "Press Enter to exit"
