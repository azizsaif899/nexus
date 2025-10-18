# Visual Automation Manager - Dedicated Script
param([string]$Action = "start")

$APP_NAME = "Visual Automation"
$APP_PORT = 3005
$APP_PATH = "C:\nexus\apps\visual-automation"

Write-Host "Visual Automation Manager" -ForegroundColor Magenta
Write-Host "========================" -ForegroundColor Magenta

function Test-Port($port) {
    try { return (Test-NetConnection localhost -Port $port -WarningAction SilentlyContinue).TcpTestSucceeded }
    catch { return $false }
}

function Kill-Port($port) {
    Write-Host "Killing all processes on port $port..." -ForegroundColor Red
    Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | ForEach-Object {
        $process = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "   Killing: $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Yellow
            Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
        }
    }
    Start-Sleep 2
}

function Clear-Cache {
    Write-Host "Clearing Visual Automation cache..." -ForegroundColor Cyan
    
    if (Test-Path $APP_PATH) {
        Set-Location $APP_PATH
        
        # Clear cache directories
        @(".next", "dist", "build", ".vite", "node_modules\.cache", ".turbo") | ForEach-Object {
            if (Test-Path $_) {
                Remove-Item $_ -Recurse -Force -ErrorAction SilentlyContinue
                Write-Host "   Cleared: $_" -ForegroundColor Green
            }
        }
        
        # Clear npm cache
        npm cache clean --force --silent 2>$null
        Write-Host "   NPM cache cleared" -ForegroundColor Green
        
        Set-Location "C:\nexus"
    }
}

function Install-Dependencies {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    
    if (Test-Path $APP_PATH) {
        Set-Location $APP_PATH
        
        if (-not (Test-Path "node_modules") -or -not (Test-Path "package-lock.json")) {
            Write-Host "   Installing fresh dependencies..." -ForegroundColor Cyan
            npm install --silent
            Write-Host "   Dependencies installed" -ForegroundColor Green
        } else {
            Write-Host "   Dependencies already installed" -ForegroundColor Green
        }
        
        Set-Location "C:\nexus"
    }
}

function Start-VisualAutomation {
    Write-Host "Starting Visual Automation..." -ForegroundColor Green
    
    # Check if app directory exists
    if (-not (Test-Path $APP_PATH)) {
        Write-Host "App directory not found: $APP_PATH" -ForegroundColor Red
        return
    }
    
    # Kill existing processes
    if (Test-Port $APP_PORT) {
        Kill-Port $APP_PORT
    }
    
    # Clear cache
    Clear-Cache
    
    # Install dependencies
    Install-Dependencies
    
    # Start the application
    Write-Host "Launching Visual Automation on port $APP_PORT..." -ForegroundColor Magenta
    
    $startCmd = "cd '$APP_PATH'; npm run dev -- --port $APP_PORT"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $startCmd
    
    # Wait and verify
    Write-Host "Waiting for application to start..." -ForegroundColor Yellow
    Start-Sleep 8
    
    if (Test-Port $APP_PORT) {
        Write-Host "Visual Automation started successfully!" -ForegroundColor Green
        Write-Host "URL: http://localhost:$APP_PORT" -ForegroundColor Cyan
        Write-Host "Ready to use!" -ForegroundColor Magenta
    } else {
        Write-Host "Failed to start Visual Automation" -ForegroundColor Red
        Write-Host "Check the PowerShell window for errors" -ForegroundColor Yellow
    }
}

function Stop-VisualAutomation {
    Write-Host "Stopping Visual Automation..." -ForegroundColor Red
    Kill-Port $APP_PORT
    Write-Host "Visual Automation stopped!" -ForegroundColor Green
}

function Show-Status {
    $running = Test-Port $APP_PORT
    $status = if ($running) { "RUNNING" } else { "STOPPED" }
    $color = if ($running) { "Green" } else { "Red" }
    
    Write-Host "Visual Automation Status:" -ForegroundColor White
    Write-Host "   App: $APP_NAME" -ForegroundColor Gray
    Write-Host "   Port: $APP_PORT" -ForegroundColor Gray
    Write-Host "   Status: $status" -ForegroundColor $color
    
    if ($running) {
        Write-Host "   URL: http://localhost:$APP_PORT" -ForegroundColor Cyan
    }
}

function Show-Help {
    Write-Host "Usage: .\visual-automation-manager.ps1 -Action [action]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Actions:" -ForegroundColor White
    Write-Host "  start      - Start Visual Automation (default)" -ForegroundColor Green
    Write-Host "  stop       - Stop Visual Automation" -ForegroundColor Red
    Write-Host "  restart    - Restart Visual Automation" -ForegroundColor Blue
    Write-Host "  status     - Show current status" -ForegroundColor White
    Write-Host "  clean      - Clear cache only" -ForegroundColor Cyan
    Write-Host "  fresh      - Full clean start" -ForegroundColor Magenta
    Write-Host "  help       - Show this help" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\visual-automation-manager.ps1" -ForegroundColor Gray
    Write-Host "  .\visual-automation-manager.ps1 -Action fresh" -ForegroundColor Gray
    Write-Host "  .\visual-automation-manager.ps1 -Action status" -ForegroundColor Gray
}

# Main execution
switch ($Action.ToLower()) {
    "start" { Start-VisualAutomation }
    "stop" { Stop-VisualAutomation }
    "restart" { Stop-VisualAutomation; Start-Sleep 2; Start-VisualAutomation }
    "status" { Show-Status }
    "clean" { Clear-Cache; Write-Host "Cache cleared!" -ForegroundColor Green }
    "fresh" { 
        Write-Host "Fresh start initiated..." -ForegroundColor Magenta
        Stop-VisualAutomation
        Clear-Cache
        Start-Sleep 2
        Start-VisualAutomation
    }
    "help" { Show-Help }
    default { Show-Help }
}