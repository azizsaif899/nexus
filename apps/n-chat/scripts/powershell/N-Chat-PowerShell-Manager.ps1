# ===============================================
# 🚀 N-Chat PowerShell Manager
# مدير تطبيق N-Chat الشامل - PowerShell Edition
# Compatible with Windows PowerShell & PowerShell Core
# ===============================================

param(
    [int]$Action = 0,
    [switch]$AutoStart = $false
)

# Set console encoding for Arabic text
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "N-Chat Manager - PowerShell Edition"

# Colors for better UI
$Colors = @{
    Header  = "Cyan"
    Success = "Green" 
    Warning = "Yellow"
    Error   = "Red"
    Info    = "Blue"
    Menu    = "White"
}

function Write-ColorText {
    param([string]$Text, [string]$Color = "White")
    Write-Host $Text -ForegroundColor $Colors[$Color]
}

function Show-Header {
    Clear-Host
    Write-ColorText "=" * 60 -Color "Header"
    Write-ColorText "    🚀 N-Chat PowerShell Manager" -Color "Header"
    Write-ColorText "    Port: 3003 - Next.js 15.5 + React 19" -Color "Info"
    Write-ColorText "    مدير تطبيق N-Chat الشامل - إصدار PowerShell" -Color "Info"
    Write-ColorText "=" * 60 -Color "Header"
    Write-Host
}

function Test-Port {
    param([int]$Port)
    try {
        $connection = Test-NetConnection -ComputerName "localhost" -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
        return $connection
    }
    catch {
        return $false
    }
}

function Stop-PortProcesses {
    param([int]$Port)
    Write-ColorText "🔥 Killing processes on port $Port..." -Color "Warning"
    
    try {
        $processes = netstat -ano | Select-String ":$Port"
        if ($processes) {
            foreach ($line in $processes) {
                $parts = $line.ToString().Trim() -split '\s+'
                if ($parts.Length -ge 5) {
                    $processId = $parts[4]
                    try {
                        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                        Write-ColorText "✅ Killed process $processId" -Color "Success"
                    }
                    catch {
                        Write-ColorText "⚠️ Could not kill process $processId" -Color "Warning"
                    }
                }
            }
        }
        else {
            Write-ColorText "ℹ️ No processes found on port $Port" -Color "Info"
        }
    }
    catch {
        Write-ColorText "❌ Error checking port processes: $_" -Color "Error"
    }
}

function Clear-ProjectCache {
    Write-ColorText "🧹 Clearing project cache and temp files..." -Color "Info"
    
    $foldersToDelete = @(".next", ".swc", "dist", "build", "node_modules\.cache")
    
    foreach ($folder in $foldersToDelete) {
        $fullPath = Join-Path $PWD $folder
        if (Test-Path $fullPath) {
            try {
                Remove-Item $fullPath -Recurse -Force -ErrorAction Stop
                Write-ColorText "✅ Deleted $folder" -Color "Success"
            }
            catch {
                Write-ColorText "⚠️ Could not delete $folder`: $_" -Color "Warning"
            }
        }
        else {
            Write-ColorText "ℹ️ $folder not found" -Color "Info"
        }
    }
    
    # Clear npm cache
    try {
        Write-ColorText "🧹 Clearing npm cache..." -Color "Info"
        npm cache clean --force 2>$null
        Write-ColorText "✅ NPM cache cleared" -Color "Success"
    }
    catch {
        Write-ColorText "⚠️ Could not clear npm cache" -Color "Warning"
    }
}

function Start-DevServer {
    Write-ColorText "🚀 Starting N-Chat Development Server..." -Color "Info"
    Write-ColorText "📱 Server will be available at: http://localhost:3003" -Color "Success"
    Write-ColorText "🛑 Press Ctrl+C to stop the server" -Color "Warning"
    Write-Host
    
    try {
        # Ensure we're in the correct directory
        if ((Get-Location).Path -ne "C:\nexus\apps\n-chat") {
            Set-Location "C:\nexus\apps\n-chat"
        }
        
        # Start the development server using the working method
        & npx next dev --port 3003
    }
    catch {
        Write-ColorText "❌ Failed to start development server: $_" -Color "Error"
        Read-Host "Press Enter to continue..."
    }
}

function Start-ProductionServer {
    Write-ColorText "🏭 Starting Production Server..." -Color "Info"
    
    try {
        Write-ColorText "🏗️ Building project..." -Color "Info"
        & npm run build
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorText "✅ Build successful!" -Color "Success"
            Write-ColorText "🚀 Starting production server..." -Color "Info"
            & npm start
        }
        else {
            Write-ColorText "❌ Build failed!" -Color "Error"
        }
    }
    catch {
        Write-ColorText "❌ Production start failed: $_" -Color "Error"
    }
}

function Invoke-TypeCheck {
    Write-ColorText "📝 Running TypeScript type check..." -Color "Info"
    
    try {
        & npx tsc --noEmit
        if ($LASTEXITCODE -eq 0) {
            Write-ColorText "✅ Type check passed!" -Color "Success"
        }
        else {
            Write-ColorText "❌ Type check failed!" -Color "Error"
        }
    }
    catch {
        Write-ColorText "❌ Type check error: $_" -Color "Error"
    }
}

function Invoke-ProjectBuild {
    Write-ColorText "🏗️ Building project..." -Color "Info"
    
    try {
        & npm run build
        if ($LASTEXITCODE -eq 0) {
            Write-ColorText "✅ Build successful!" -Color "Success"
        }
        else {
            Write-ColorText "❌ Build failed!" -Color "Error"
        }
    }
    catch {
        Write-ColorText "❌ Build error: $_" -Color "Error"
    }
}

function Install-Dependencies {
    Write-ColorText "📦 Installing/updating dependencies..." -Color "Info"
    
    try {
        & npm install --legacy-peer-deps
        if ($LASTEXITCODE -eq 0) {
            Write-ColorText "✅ Dependencies installed successfully!" -Color "Success"
        }
        else {
            Write-ColorText "❌ Dependencies installation failed!" -Color "Error"
        }
    }
    catch {
        Write-ColorText "❌ Installation error: $_" -Color "Error"
    }
}

function Show-ProjectStatus {
    Write-ColorText "📊 Project Status:" -Color "Header"
    Write-Host
    
    # Check current directory
    Write-ColorText "📁 Current Directory: $(Get-Location)" -Color "Info"
    
    # Check if package.json exists
    if (Test-Path "package.json") {
        Write-ColorText "✅ package.json found" -Color "Success"
        
        # Get project info
        try {
            $package = Get-Content "package.json" | ConvertFrom-Json
            Write-ColorText "📝 Project: $($package.name) v$($package.version)" -Color "Info"
        }
        catch {
            Write-ColorText "⚠️ Could not read package.json" -Color "Warning"
        }
    }
    else {
        Write-ColorText "❌ package.json not found!" -Color "Error"
    }
    
    # Check port status
    $portStatus = Test-Port -Port 3003
    if ($portStatus) {
        Write-ColorText "🔴 Port 3003 is BUSY" -Color "Error"
    }
    else {
        Write-ColorText "🟢 Port 3003 is FREE" -Color "Success"
    }
    
    # Check important directories
    $directories = @(".next", "node_modules", "scripts", "app")
    foreach ($dir in $directories) {
        if (Test-Path $dir) {
            Write-ColorText "📂 $dir exists" -Color "Success"
        }
        else {
            Write-ColorText "📂 $dir missing" -Color "Warning"
        }
    }
}

function Show-Menu {
    Write-Host
    Write-ColorText "📋 Choose Action / اختر العملية:" -Color "Header"
    Write-Host
    Write-ColorText "    [1] Quick Start     - تشغيل سريع" -Color "Menu"
    Write-ColorText "    [2] Check Status    - فحص الحالة" -Color "Menu"
    Write-ColorText "    [3] Kill Port       - إيقاف المنفذ 3003" -Color "Menu"
    Write-ColorText "    [4] Clear Cache     - تنظيف الكاش" -Color "Menu"
    Write-ColorText "    [5] Type Check      - فحص TypeScript" -Color "Menu"
    Write-ColorText "    [6] Build Project   - بناء المشروع" -Color "Menu"
    Write-ColorText "    [7] Clean Start     - تشغيل نظيف" -Color "Menu"
    Write-ColorText "    [8] Full Restart    - إعادة تشغيل كاملة" -Color "Menu"
    Write-ColorText "    [9] Production      - تشغيل الإنتاج" -Color "Menu"
    Write-ColorText "    [10] Install Deps   - تثبيت التبعيات" -Color "Menu"
    Write-ColorText "    [0] Exit            - خروج" -Color "Menu"
    Write-Host
}

function Invoke-Action {
    param([int]$ActionNumber)
    
    switch ($ActionNumber) {
        1 {
            # Quick Start
            Write-ColorText "⚡ Quick Start - التشغيل السريع" -Color "Header"
            Stop-PortProcesses -Port 3003
            Clear-ProjectCache
            Write-ColorText "⏳ Starting in 2 seconds..." -Color "Info"
            Start-Sleep -Seconds 2
            Start-DevServer
        }
        2 {
            # Check Status
            Show-ProjectStatus
            Read-Host "`nPress Enter to continue..."
        }
        3 {
            # Kill Port
            Stop-PortProcesses -Port 3003
            Read-Host "`nPress Enter to continue..."
        }
        4 {
            # Clear Cache
            Clear-ProjectCache
            Read-Host "`nPress Enter to continue..."
        }
        5 {
            # Type Check
            Invoke-TypeCheck
            Read-Host "`nPress Enter to continue..."
        }
        6 {
            # Build
            Invoke-ProjectBuild
            Read-Host "`nPress Enter to continue..."
        }
        7 {
            # Clean Start
            Write-ColorText "🧹 Clean Start - التشغيل النظيف" -Color "Header"
            Stop-PortProcesses -Port 3003
            Clear-ProjectCache
            Write-ColorText "⏳ Starting clean server in 3 seconds..." -Color "Info"
            Start-Sleep -Seconds 3
            Start-DevServer
        }
        8 {
            # Full Restart
            Write-ColorText "🔄 Full Restart - إعادة التشغيل الكاملة" -Color "Header"
            Stop-PortProcesses -Port 3003
            Clear-ProjectCache
            Install-Dependencies
            Write-ColorText "⏳ Starting fresh server in 3 seconds..." -Color "Info"
            Start-Sleep -Seconds 3
            Start-DevServer
        }
        9 {
            # Production
            Start-ProductionServer
        }
        10 {
            # Install Dependencies
            Install-Dependencies
            Read-Host "`nPress Enter to continue..."
        }
        0 {
            # Exit
            Write-ColorText "👋 Goodbye! وداعاً!" -Color "Info"
            exit 0
        }
        default {
            Write-ColorText "❌ Invalid choice! اختيار غير صحيح!" -Color "Error"
            Start-Sleep -Seconds 1
        }
    }
}

# Main Script Logic
try {
    # Ensure we're in the correct directory
    $targetPath = "C:\nexus\apps\n-chat"
    if (-not (Test-Path $targetPath)) {
        Write-ColorText "❌ N-Chat directory not found: $targetPath" -Color "Error"
        exit 1
    }
    
    Set-Location $targetPath
    
    # If AutoStart is specified, run Quick Start
    if ($AutoStart) {
        Show-Header
        Invoke-Action -ActionNumber 1
        exit 0
    }
    
    # If Action is specified via parameter, execute it
    if ($Action -gt 0) {
        Show-Header
        Invoke-Action -ActionNumber $Action
        exit 0
    }
    
    # Interactive mode
    do {
        Show-Header
        Show-Menu
        
        try {
            $choice = Read-Host "Enter choice (0-10)"
            $choiceNum = [int]$choice
            Invoke-Action -ActionNumber $choiceNum
        }
        catch {
            Write-ColorText "❌ Please enter a valid number!" -Color "Error"
            Start-Sleep -Seconds 1
        }
        
    } while ($true)
    
}
catch {
    Write-ColorText "❌ Unexpected error: $_" -Color "Error"
    Read-Host "Press Enter to exit..."
    exit 1
}