Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   تشغيل نظام الأتمتة المرئية الاحترافي" -ForegroundColor Green
Write-Host "   Visual Workflow Automation System" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "C:\nexus\apps\visual-automation"

Write-Host "التحقق من Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ خطأ: Node.js غير مثبت أو غير موجود في PATH" -ForegroundColor Red
    Read-Host "اضغط Enter للخروج"
    exit 1
}

Write-Host "التحقق من npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ خطأ: npm غير مثبت أو غير موجود في PATH" -ForegroundColor Red
    Read-Host "اضغط Enter للخروج"
    exit 1
}

Write-Host ""
Write-Host "تثبيت المكتبات..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ خطأ في تثبيت المكتبات" -ForegroundColor Red
    Read-Host "اضغط Enter للخروج"
    exit 1
}

Write-Host ""
Write-Host "✅ تم تثبيت المكتبات بنجاح" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 تشغيل التطبيق على المنفذ 4100..." -ForegroundColor Cyan
Write-Host "🌐 افتح المتصفح على: http://localhost:4100" -ForegroundColor Yellow
Write-Host ""
Write-Host "⏹️  للإيقاف: اضغط Ctrl+C" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Cyan

npm run dev