# Visual Automation Launcher
Write-Host "🚀 Starting Visual Automation on Port 3005..." -ForegroundColor Green

# Change to the app directory
Set-Location "C:\nexus\apps\visual-automation"

# Check if port 3005 is already in use
$port = Get-NetTCPConnection -LocalPort 3005 -ErrorAction SilentlyContinue
if ($port) {
    Write-Host "⚠️ Port 3005 is already in use. Killing existing process..." -ForegroundColor Yellow
    $processId = (Get-NetTCPConnection -LocalPort 3005).OwningProcess
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# Install dependencies if needed
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
    npm install
}

# Start the application
Write-Host "🎯 Launching Visual Automation..." -ForegroundColor Cyan
Write-Host "📍 URL: http://localhost:3005" -ForegroundColor Green
Write-Host "⏹️ Press Ctrl+C to stop" -ForegroundColor Yellow

# Start in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\nexus\apps\visual-automation'; npm run dev"

Write-Host "✅ Visual Automation started successfully!" -ForegroundColor Green
Write-Host "🌐 Open: http://localhost:3005" -ForegroundColor Cyan