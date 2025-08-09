# Python 3.11 Direct Installation Script
Write-Host "🐍 Installing Python 3.11.9..." -ForegroundColor Green

$pythonUrl = "https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe"
$installerPath = "$env:TEMP\python-3.11.9-amd64.exe"

try {
    Write-Host "📥 Downloading Python installer..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $pythonUrl -OutFile $installerPath
    
    Write-Host "🔧 Installing Python..." -ForegroundColor Yellow
    Start-Process -FilePath $installerPath -ArgumentList "/quiet", "InstallAllUsers=1", "PrependPath=1", "Include_test=0" -Wait
    
    Write-Host "🧹 Cleaning up..." -ForegroundColor Yellow
    Remove-Item $installerPath -Force
    
    Write-Host "✅ Python installation complete!" -ForegroundColor Green
    Write-Host "🔄 Please restart your command prompt and run: python --version" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Installation failed: $($_.Exception.Message)" -ForegroundColor Red
}

Read-Host "Press Enter to continue..."