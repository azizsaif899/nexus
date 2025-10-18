# N-Chat PowerShell Management Script - Simple Version
# سكريپت PowerShell لإدارة N-Chat - نسخة مبسطة
param(
    [string]$Command = ""
)

# Set console encoding to UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "N-Chat PowerShell Manager"

# Colors
$Green = "Green"
$Red = "Red"
$Yellow = "Yellow"
$Blue = "Blue"
$Cyan = "Cyan"

function Show-Header {
    Clear-Host
    Write-Host "=============================================================" -ForegroundColor $Blue
    Write-Host "                 N-Chat PowerShell Manager                  " -ForegroundColor $Blue
    Write-Host "                   مدير N-Chat PowerShell                    " -ForegroundColor $Blue
    Write-Host "=============================================================" -ForegroundColor $Blue
    Write-Host ""
}

function Show-Menu {
    Write-Host "المهام المتاحة / Available Tasks:" -ForegroundColor $Cyan
    Write-Host ""
    Write-Host "  [check]      فحص حالة المنفذ 3003" -ForegroundColor $Green
    Write-Host "  [kill]       إيقاف المنفذ 3003" -ForegroundColor $Green
    Write-Host "  [clear]      تنظيف التخزين المؤقت" -ForegroundColor $Green
    Write-Host "  [dev]        بدء خادم التطوير" -ForegroundColor $Green
    Write-Host "  [prod]       بدء خادم الإنتاج" -ForegroundColor $Green
    Write-Host "  [clean]      تنظيف وبدء" -ForegroundColor $Green
    Write-Host "  [restart]    إعادة تشغيل كاملة" -ForegroundColor $Green
    Write-Host "  [type]       فحص TypeScript" -ForegroundColor $Green
    Write-Host "  [build]      بناء المشروع" -ForegroundColor $Green
    Write-Host "  [install]    تثبيت الحزم" -ForegroundColor $Green
    Write-Host "  [status]     حالة النظام" -ForegroundColor $Green
    Write-Host "  [exit]       خروج" -ForegroundColor $Green
    Write-Host ""
}

function Set-WorkingDirectory {
    $scriptPath = "C:\nexus\apps\n-chat"
    if (Test-Path $scriptPath) {
        Set-Location $scriptPath
        Write-Host "تم الانتقال إلى: $scriptPath" -ForegroundColor $Green
    }
    else {
        Write-Host "مجلد N-Chat غير موجود: $scriptPath" -ForegroundColor $Red
        exit 1
    }
}

function Invoke-NpmScript {
    param([string]$ScriptName)
    
    Write-Host "تشغيل: npm run $ScriptName" -ForegroundColor $Yellow
    try {
        & npm run $ScriptName
        if ($LASTEXITCODE -eq 0) {
            Write-Host "تم تنفيذ $ScriptName بنجاح" -ForegroundColor $Green
        }
        else {
            Write-Host "فشل في تنفيذ $ScriptName" -ForegroundColor $Red
        }
    }
    catch {
        Write-Host "خطأ في تنفيذ $ScriptName : $($_.Exception.Message)" -ForegroundColor $Red
    }
}

function Show-SystemStatus {
    Write-Host "حالة النظام / System Status:" -ForegroundColor $Cyan
    Write-Host ""
    
    # Check if in correct directory
    $currentPath = Get-Location
    Write-Host "المجلد الحالي: $currentPath" -ForegroundColor $Blue
    
    # Check package.json
    if (Test-Path "package.json") {
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        Write-Host "اسم المشروع: $($packageJson.name)" -ForegroundColor $Blue
        Write-Host "الإصدار: $($packageJson.version)" -ForegroundColor $Blue
        Write-Host "Next.js: $($packageJson.dependencies.next)" -ForegroundColor $Blue
        Write-Host "React: $($packageJson.dependencies.react)" -ForegroundColor $Blue
    }
    
    # Check port 3003
    Write-Host ""
    Write-Host "فحص المنفذ 3003..." -ForegroundColor $Yellow
    try {
        $portCheck = netstat -an | Select-String ":3003"
        if ($portCheck) {
            Write-Host "المنفذ 3003 مستخدم" -ForegroundColor $Yellow
        }
        else {
            Write-Host "المنفذ 3003 متاح" -ForegroundColor $Green
        }
    }
    catch {
        Write-Host "خطأ في فحص المنفذ" -ForegroundColor $Red
    }
    
    # Check important files
    Write-Host ""
    Write-Host "الملفات المهمة:" -ForegroundColor $Cyan
    $files = @("package.json", "next.config.js", "tailwind.config.js", "tsconfig.json")
    foreach ($file in $files) {
        if (Test-Path $file) {
            Write-Host "  موجود: $file" -ForegroundColor $Green
        }
        else {
            Write-Host "  مفقود: $file" -ForegroundColor $Red
        }
    }
}

function Start-InteractiveMode {
    while ($true) {
        Show-Header
        Show-Menu
        
        $userInput = Read-Host "أدخل الأمر المطلوب / Enter command"
        
        switch ($userInput.ToLower()) {
            "check" { Invoke-NpmScript "check-port" }
            "kill" { Invoke-NpmScript "kill-port" }
            "clear" { Invoke-NpmScript "clear-cache" }
            "dev" { Invoke-NpmScript "dev" }
            "prod" { Invoke-NpmScript "start" }
            "clean" { Invoke-NpmScript "clean-start" }
            "restart" { Invoke-NpmScript "full-restart" }
            "type" { Invoke-NpmScript "type-check" }
            "build" { Invoke-NpmScript "build" }
            "install" { 
                Write-Host "تثبيت الحزم..." -ForegroundColor $Yellow
                & npm install --legacy-peer-deps
            }
            "status" { Show-SystemStatus }
            "exit" { 
                Write-Host "وداعا! / Goodbye!" -ForegroundColor $Green
                exit 0 
            }
            default { 
                Write-Host "أمر غير معروف! / Unknown command!" -ForegroundColor $Red 
            }
        }
        
        Write-Host ""
        Write-Host "اضغط أي مفتاح للمتابعة... / Press any key to continue..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

# Main execution
Set-WorkingDirectory

if ($Command -eq "") {
    Start-InteractiveMode
}
else {
    switch ($Command.ToLower()) {
        "check" { Invoke-NpmScript "check-port" }
        "kill" { Invoke-NpmScript "kill-port" }
        "clear" { Invoke-NpmScript "clear-cache" }
        "dev" { Invoke-NpmScript "dev" }
        "prod" { Invoke-NpmScript "start" }
        "clean" { Invoke-NpmScript "clean-start" }
        "restart" { Invoke-NpmScript "full-restart" }
        "type" { Invoke-NpmScript "type-check" }
        "build" { Invoke-NpmScript "build" }
        "install" { & npm install --legacy-peer-deps }
        "status" { Show-SystemStatus }
        default { 
            Write-Host "أمر غير معروف: $Command" -ForegroundColor $Red
            Show-Menu
        }
    }
}