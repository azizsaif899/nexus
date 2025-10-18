# Install Node.js 24.9.0
Write-Host "🚀 Installing Node.js 24.9.0..." -ForegroundColor Green

# Download Node.js 24.9.0
$url = "https://nodejs.org/dist/v24.9.0/node-v24.9.0-x64.msi"
$output = "$env:TEMP\node-v24.9.0-x64.msi"

Write-Host "📥 Downloading..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $url -OutFile $output

Write-Host "📦 Installing..." -ForegroundColor Yellow
Start-Process msiexec.exe -ArgumentList "/i `"$output`" /quiet /norestart" -Wait

Write-Host "✅ Installation complete!" -ForegroundColor Green
Write-Host "⚠️  Please restart your terminal and run: node -v" -ForegroundColor Cyan

# Cleanup
Remove-Item $output -Force