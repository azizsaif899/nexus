# ====================================================================
# CRM Nxs - تثبيت وإعداد تلقائي كامل
# ====================================================================
# هذا السكريبت يقوم بإعداد المشروع بالكامل بشكل تلقائي
# ====================================================================

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "     CRM Nxs - الإعداد التلقائي الكامل" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

# التحقق من Node.js و npm
Write-Host "🔍 التحقق من البيئة..." -ForegroundColor Yellow
Write-Host ""

try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js غير مثبت!" -ForegroundColor Red
    Write-Host "   قم بتثبيت Node.js 18+ من: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

try {
    $npmVersion = npm --version
    Write-Host "✅ npm: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm غير متوفر!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

# تثبيت التبعيات
Write-Host "📦 تثبيت التبعيات..." -ForegroundColor Yellow
Write-Host ""

npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ فشل تثبيت التبعيات!" -ForegroundColor Red
    Write-Host "   جرب: npm cache clean --force ثم npm install" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "✅ تم تثبيت التبعيات بنجاح!" -ForegroundColor Green
Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

# فحص TypeScript
Write-Host "🔍 فحص TypeScript..." -ForegroundColor Yellow
Write-Host ""

npm run type-check

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "⚠️  يوجد أخطاء TypeScript" -ForegroundColor Yellow
    Write-Host "   يمكنك المتابعة لكن يُفضل إصلاحها" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "✅ لا توجد أخطاء TypeScript!" -ForegroundColor Green
}

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

# الإعداد مكتمل
Write-Host "🎉 اكتمل الإعداد بنجاح!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 الخطوات التالية:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   1. للتشغيل مباشرة:" -ForegroundColor White
Write-Host "      .\scripts\start-dev.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "   2. للتشخيص الشامل:" -ForegroundColor White
Write-Host "      .\scripts\diagnose.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "   3. للبناء للإنتاج:" -ForegroundColor White
Write-Host "      .\scripts\build.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 للمزيد من المعلومات:" -ForegroundColor Cyan
Write-Host "   • اقرأ: README.md" -ForegroundColor White
Write-Host "   • اقرأ: QUICK_START.md" -ForegroundColor White
Write-Host "   • اقرأ: START_HERE.md" -ForegroundColor White
Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 نصيحة: شغّل start-dev.ps1 الآن للبدء!" -ForegroundColor Yellow
Write-Host ""
