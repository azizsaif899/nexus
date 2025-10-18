# Nexus Master Manager - Complete System Controller
param([string]$Action = "help", [string]$App = "all")

$APPS = @{
    "nexus-ai"          = @{ port = 3001; name = "Nexus AI Dashboard"; path = "apps\nexus-ai-main"; cmd = "npx nx serve nexus-ai --port 3001" }
    "n-chat"            = @{ port = 3003; name = "N-Chat App"; path = "apps\n-chat"; cmd = "npx next dev -p 3003" }
    "crm-system"        = @{ port = 3004; name = "CRM System"; path = "apps\crm-system"; cmd = "npm run dev -- --port 3004" }
    "visual-automation" = @{ port = 3005; name = "Visual Automation"; path = "apps\visual-automation"; cmd = "npm run dev -- --port 3005" }
    "web-chatbot"       = @{ port = 3006; name = "Web Chatbot"; path = "apps\web-chatbot"; cmd = "npm run dev -- --port 3006" }
}

Write-Host " Nexus Master Manager v2.0" -ForegroundColor Cyan

function Test-AppPort($port) {
    try { return (Test-NetConnection localhost -Port $port -WarningAction SilentlyContinue).TcpTestSucceeded }
    catch { return $false }
}

function Kill-AppPort($port) {
    Write-Host "🔥 Killing processes on port $port..." -ForegroundColor Yellow
    Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | ForEach-Object {
        $process = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "   Killing: $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Red
            Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
        }
    }
    Start-Sleep 1
}

function Clear-AppCache($appName) {
    $app = $APPS[$appName]
    if (-not $app) { return }
    
    Write-Host "🧹 Clearing cache for $($app.name)..." -ForegroundColor Cyan
    $appPath = "C:\nexus\$($app.path)"
    
    # Clear common cache directories
    @(".next", "dist", "build", "node_modules\.cache", ".vite") | ForEach-Object {
        $cachePath = Join-Path $appPath $_
        if (Test-Path $cachePath) {
            Remove-Item $cachePath -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "   Cleared: $_" -ForegroundColor Gray
        }
    }
}

function Start-App($appName) {
    $app = $APPS[$appName]
    if (-not $app) { Write-Host " App not found: $appName" -ForegroundColor Red; return }
    
    Write-Host "🚀 Starting $($app.name) on port $($app.port)..." -ForegroundColor Green
    
    # Kill existing processes
    if (Test-AppPort $app.port) {
        Kill-AppPort $app.port
        Start-Sleep 2
    }
    
    # Clear cache
    Clear-AppCache $appName
    
    # Install dependencies if needed
    $appPath = "C:\nexus\$($app.path)"
    if (-not (Test-Path "$appPath\node_modules")) {
        Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
        Set-Location $appPath
        npm install --silent
        Set-Location "C:\nexus"
    }
    
    # Start the application
    $startCmd = "cd '$appPath'; $($app.cmd)"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $startCmd
    
    # Wait and verify
    Start-Sleep 5
    if (Test-AppPort $app.port) {
        Write-Host "✅ $($app.name) started successfully!" -ForegroundColor Green
        Write-Host "🌐 URL: http://localhost:$($app.port)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Failed to start $($app.name)" -ForegroundColor Red
    }
}

function Stop-App($appName) {
    $app = $APPS[$appName]
    if (-not $app) { Write-Host " App not found: $appName" -ForegroundColor Red; return }
    
    Write-Host " Stopping $($app.name)..." -ForegroundColor Red
    Kill-AppPort $app.port
    Write-Host " $($app.name) stopped!" -ForegroundColor Green
}

function Show-Status {
    Write-Host " Nexus Applications Status:" -ForegroundColor White
    $APPS.Keys | Sort-Object | ForEach-Object {
        $app = $APPS[$_]
        $running = Test-AppPort $app.port
        $status = if ($running) { " RUNNING" } else { " STOPPED" }
        $color = if ($running) { "Green" } else { "Red" }
        Write-Host "$($app.name)".PadRight(20) + " | Port: $($app.port) | $status" -ForegroundColor $color
    }
}

function Show-URLs {
    Write-Host " Application URLs:" -ForegroundColor Cyan
    $APPS.Keys | Sort-Object | ForEach-Object {
        $app = $APPS[$_]
        $running = Test-AppPort $app.port
        $icon = if ($running) { "" } else { "" }
        Write-Host "$icon $($app.name): http://localhost:$($app.port)" -ForegroundColor $(if ($running) { "Green" } else { "Red" })
    }
}

# Main logic
switch ($Action.ToLower()) {
    "start-all" { $APPS.Keys | ForEach-Object { Start-App $_; Start-Sleep 2 } }
    "stop-all" { $APPS.Keys | ForEach-Object { Stop-App $_ } }
    "restart-all" { $APPS.Keys | ForEach-Object { Stop-App $_ }; Start-Sleep 3; $APPS.Keys | ForEach-Object { Start-App $_; Start-Sleep 2 } }
    "status-all" { Show-Status }
    "urls" { Show-URLs }
    "start" { if ($App -ne "all") { Start-App $App } else { Write-Host " Specify app with -App parameter" -ForegroundColor Red } }
    "stop" { if ($App -ne "all") { Stop-App $App } else { Write-Host " Specify app with -App parameter" -ForegroundColor Red } }
    "restart" { if ($App -ne "all") { Stop-App $App; Start-Sleep 2; Start-App $App } else { Write-Host " Specify app with -App parameter" -ForegroundColor Red } }
    "status" { if ($App -ne "all") { $app = $APPS[$App]; if ($app) { Write-Host "$($app.name): $(if (Test-AppPort $app.port) { 'RUNNING' } else { 'STOPPED' })" } } else { Show-Status } }
    "kill-all" { 
        Write-Host "💀 Killing all Node processes..." -ForegroundColor Red
        taskkill /F /IM node.exe /T 2>$null
        taskkill /F /IM npm.exe /T 2>$null
        taskkill /F /IM npx.exe /T 2>$null
        Write-Host "✅ All processes killed!" -ForegroundColor Green
    }
    "clean-cache" {
        Write-Host "🧹 Cleaning all application caches..." -ForegroundColor Cyan
        $APPS.Keys | ForEach-Object { Clear-AppCache $_ }
        Write-Host "✅ Cache cleaning completed!" -ForegroundColor Green
    }
    "fresh-start" {
        if ($App -ne "all") {
            Write-Host "🔄 Fresh start for $App..." -ForegroundColor Magenta
            $app = $APPS[$App]
            if ($app) {
                Kill-AppPort $app.port
                Clear-AppCache $App
                Start-Sleep 2
                Start-App $App
            }
        } else {
            Write-Host "🔄 Fresh start for all apps..." -ForegroundColor Magenta
            $APPS.Keys | ForEach-Object { Stop-App $_ }
            $APPS.Keys | ForEach-Object { Clear-AppCache $_ }
            Start-Sleep 3
            $APPS.Keys | ForEach-Object { Start-App $_; Start-Sleep 2 }
        }
    }
    "help" { 
        Write-Host "Usage: .\Nexus-Master-Manager.ps1 -Action [action] [-App [app]]" -ForegroundColor Yellow
        Write-Host "Actions: start-all, stop-all, restart-all, status-all, urls, start, stop, restart, status, kill-all, clean-cache, fresh-start" -ForegroundColor White
        Write-Host "Apps: $($APPS.Keys -join ', ')" -ForegroundColor Gray
    }
    default { Write-Host " Unknown action. Use -Action help" -ForegroundColor Red }
}
