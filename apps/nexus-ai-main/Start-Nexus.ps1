# Nexus AI - PowerShell Startup Script
# Enhanced version with error handling and auto-restart

param(
    [switch]$AutoRestart = $false
)

function Start-NexusServer {
    Write-Host ""
    Write-Host "===============================================" -ForegroundColor Cyan
    Write-Host "         🚀 Nexus AI - Development Server" -ForegroundColor Green
    Write-Host "===============================================" -ForegroundColor Cyan
    Write-Host ""

    # Kill existing processes on port 3000
    Write-Host "🧹 تنظيف المنفذ 3000..." -ForegroundColor Yellow
    try {
        & npx kill-port 3000 2>$null
    }
    catch {
        # Port might not be in use, continue
    }

    # Clear cache
    Write-Host "🗂️ تنظيف الكاش..." -ForegroundColor Yellow
    if (Test-Path "node_modules\.vite") {
        Remove-Item "node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue
    }
    if (Test-Path "dist") {
        Remove-Item "dist" -Recurse -Force -ErrorAction SilentlyContinue
    }

    Write-Host ""
    Write-Host "▶️ تشغيل الخادم على http://localhost:3000" -ForegroundColor Green
    Write-Host "💡 للإيقاف اضغط Ctrl+C" -ForegroundColor Cyan
    Write-Host "===============================================" -ForegroundColor Cyan
    Write-Host ""

    # Start the server
    try {
        & npx vite --port 3000 --host
        return $true
    }
    catch {
        Write-Host "❌ خطأ في تشغيل الخادم: $_" -ForegroundColor Red
        return $false
    }
}

# Main execution
do {
    $success = Start-NexusServer
    
    if (-Not $success) {
        Write-Host ""
        Write-Host "❌ فشل في تشغيل الخادم" -ForegroundColor Red
        break
    }

    if ($AutoRestart) {
        Write-Host ""
        Write-Host "⚠️ الخادم توقف! إعادة التشغيل في 3 ثوان..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
        continue
    }

    Write-Host ""
    $restart = Read-Host "⚠️ الخادم توقف! هل تريد إعادة التشغيل؟ (y/n)"
    
} while ($restart -eq 'y' -or $restart -eq 'yes' -or $restart -eq 'Y')

Write-Host ""
Write-Host "👋 شكراً لاستخدام Nexus AI" -ForegroundColor Green