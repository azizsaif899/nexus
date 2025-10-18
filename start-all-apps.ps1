param(
    [switch]$Clean,
    [switch]$Help
)

if ($Help) {
    Write-Host "Nexus AI Platform Launcher" -ForegroundColor Cyan
    Write-Host "Usage: .\start-all-apps.ps1 [-Clean] [-Help]" -ForegroundColor White
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "  -Clean    Clean node_modules and reinstall dependencies" -ForegroundColor White
    Write-Host "  -Help     Show this help message" -ForegroundColor White
    Write-Host ""
    Write-Host "Applications:" -ForegroundColor Yellow
    Write-Host "  Main Page:     http://localhost:3000" -ForegroundColor White
    Write-Host "  N-Chat:        http://localhost:3003" -ForegroundColor White
    Write-Host "  Automation:    http://localhost:3005" -ForegroundColor White
    Write-Host "  Admin:         http://localhost:3001" -ForegroundColor White
    Write-Host "  CRM:           http://localhost:3002" -ForegroundColor White
    Write-Host "  API:           http://localhost:3000 (NestJS)" -ForegroundColor White
    exit
}

Write-Host "🚀 Starting Nexus AI Platform..." -ForegroundColor Cyan
Write-Host ""

$apps = @(
    @{
        Name = "Main Landing Page"
        Path = ".\apps\nexus-ai-main"
        Command = "npm run dev"
        Port = 3000
        Color = "Green"
    },
    @{
        Name = "N-Chat Application"
        Path = ".\apps\n-chat"
        Command = "npm run dev"
        Port = 3003
        Color = "Blue"
    },
    @{
        Name = "Visual Automation"
        Path = ".\apps\visual-automation"
        Command = "npm run dev"
        Port = 3005
        Color = "Magenta"
    },
    @{
        Name = "Admin Dashboard"
        Path = ".\apps\admin-dashboard"
        Command = "npm run dev"
        Port = 3001
        Color = "Yellow"
    },
    @{
        Name = "CRM System"
        Path = ".\apps\crm-system"
        Command = "npm run dev"
        Port = 3002
        Color = "Red"
    },
    @{
        Name = "API Server (NestJS)"
        Path = ".\apps\api"
        Command = "npm run start:dev"
        Port = 3000
        Color = "Cyan"
    }
)

if ($Clean) {
    Write-Host "🧹 Cleaning all applications..." -ForegroundColor Yellow
    foreach ($app in $apps) {
        if (Test-Path $app.Path) {
            Write-Host "Cleaning $($app.Name)..." -ForegroundColor $app.Color
            Set-Location $app.Path
            if (Test-Path "node_modules") {
                Remove-Item -Recurse -Force node_modules
            }
            if (Test-Path "package-lock.json") {
                Remove-Item package-lock.json
            }
            npm install
        }
    }
    Set-Location ..
}

Write-Host "📦 Installing root dependencies..." -ForegroundColor Green
npm install

Write-Host "🎯 Starting applications..." -ForegroundColor Green
Write-Host ""

foreach ($app in $apps) {
    if (Test-Path $app.Path) {
        Write-Host "Starting $($app.Name) on port $($app.Port)..." -ForegroundColor $app.Color
        $startInfo = New-Object System.Diagnostics.ProcessStartInfo
        $startInfo.FileName = "cmd.exe"
        $startInfo.Arguments = "/k cd /d $($app.Path) && $($app.Command)"
        $startInfo.UseShellExecute = $true
        $startInfo.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Normal
        [System.Diagnostics.Process]::Start($startInfo) | Out-Null

        Start-Sleep -Seconds 2
    } else {
        Write-Host "⚠️  $($app.Name) not found at $($app.Path)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ All applications are starting..." -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access your applications:" -ForegroundColor Cyan
Write-Host "   Main Page:     http://localhost:3000" -ForegroundColor White
Write-Host "   N-Chat:        http://localhost:3003" -ForegroundColor White
Write-Host "   Automation:    http://localhost:3005" -ForegroundColor White
Write-Host "   Admin:         http://localhost:3001" -ForegroundColor White
Write-Host "   CRM:           http://localhost:3002" -ForegroundColor White
Write-Host "   API:           http://localhost:3000 (NestJS)" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all applications" -ForegroundColor Yellow