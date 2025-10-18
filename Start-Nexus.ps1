param(
    [switch]$AutoRestart
)

Write-Host "🚀 تشغيل Nexus AI..." -ForegroundColor Green

# تنظيف المنفذ 3000
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
}

# الانتقال للمجلد
Set-Location "$PSScriptRoot\apps\nexus-ai-main"

# تثبيت المكتبات
if (!(Test-Path "node_modules")) {
    Write-Host "📦 تثبيت المكتبات..." -ForegroundColor Yellow
    npm install
}

# تشغيل الخادم
Write-Host "✅ الخادم يعمل على http://localhost:3000" -ForegroundColor Green

if ($AutoRestart) {
    do {
        npm run dev
        Write-Host "⚠️ الخادم توقف. إعادة تشغيل..." -ForegroundColor Yellow
        Start-Sleep 2
    } while ($true)
} else {
    npm run dev
}