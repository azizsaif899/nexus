# ===============================================
# 🚀 Nexus Applications Manager - Simple Edition
# مدير تطبيقات Nexus البسيط
# ===============================================

param(
    [int]$Action = 0
)

# Set console encoding for Arabic text
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "Nexus Apps Manager"

function Write-ColorText {
    param([string]$Text, [string]$Color = "White")
    $colorMap = @{
        "Green" = [System.ConsoleColor]::Green
        "Red" = [System.ConsoleColor]::Red
        "Yellow" = [System.ConsoleColor]::Yellow
        "Blue" = [System.ConsoleColor]::Blue
        "Cyan" = [System.ConsoleColor]::Cyan
        "Magenta" = [System.ConsoleColor]::Magenta
        "White" = [System.ConsoleColor]::White
    }
    Write-Host $Text -ForegroundColor $colorMap[$Color]
}

function Show-Header {
    Clear-Host
    Write-ColorText "=" * 60 -Color "Cyan"
    Write-ColorText "    🚀 Nexus Applications Manager" -Color "Cyan"
    Write-ColorText "    مدير تطبيقات Nexus البسيط" -Color "Blue"
    Write-ColorText "=" * 60 -Color "Cyan"
    Write-Host
}

function Test-AppPort {
    param([int]$Port)
    try {
        $processes = netstat -ano | findstr ":$Port"
        return ($processes -ne $null -and $processes.Length -gt 0)
    } catch {
        return $false
    }
}

function Stop-AppPort {
    param([int]$Port, [string]$AppName)
    Write-ColorText "🔥 Stopping $AppName on port $Port..." -Color "Yellow"
    
    try {
        $cmd = "netstat -ano | findstr :$Port"
        $result = cmd /c $cmd
        
        if ($result) {
            foreach ($line in $result) {
                $parts = $line.Trim() -split '\s+'
                if ($parts.Length -ge 5) {
                    $pid = $parts[4]
                    cmd /c "taskkill /PID $pid /F" 2>$null
                    Write-ColorText "✅ Stopped process $pid" -Color "Green"
                }
            }
        } else {
            Write-ColorText "ℹ️ No processes found on port $Port" -Color "Blue"
        }
    } catch {
        Write-ColorText "❌ Error: $_" -Color "Red"
    }
}

function Clear-AppCache {
    param([string]$AppPath, [string]$AppName)
    Write-ColorText "🧹 Clearing $AppName cache..." -Color "Blue" 
    
    $currentDir = Get-Location
    try {
        Set-Location $AppPath
        
        $folders = @(".next", ".swc", "dist", "build")
        foreach ($folder in $folders) {
            if (Test-Path $folder) {
                Remove-Item $folder -Recurse -Force -ErrorAction SilentlyContinue
                Write-ColorText "✅ Deleted $folder" -Color "Green"
            }
        }
        
        # Clear npm cache
        npm cache clean --force 2>$null
        Write-ColorText "✅ Cache cleared for $AppName" -Color "Green"
    } catch {
        Write-ColorText "⚠️ Some cache files could not be cleared" -Color "Yellow"
    } finally {
        Set-Location $currentDir
    }
}

function Show-Status {
    Write-ColorText "📊 Applications Status:" -Color "Cyan"
    Write-Host
    
    # N-Chat Status
    Write-ColorText "💬 N-Chat (Port 3003):" -Color "Magenta"
    if (Test-AppPort -Port 3003) {
        Write-ColorText "  🟢 Status: RUNNING" -Color "Green"
    } else {
        Write-ColorText "  🔴 Status: STOPPED" -Color "Red"
    }
    Write-ColorText "  📂 Path: C:\nexus\apps\n-chat" -Color "Blue"
    
    Write-Host
    
    # CRM Status  
    Write-ColorText "🏢 CRM System (Port 3004):" -Color "Cyan"
    if (Test-AppPort -Port 3004) {
        Write-ColorText "  🟢 Status: RUNNING" -Color "Green"
    } else {
        Write-ColorText "  🔴 Status: STOPPED" -Color "Red"
    }
    Write-ColorText "  📂 Path: C:\nexus\apps\crm-system" -Color "Blue"
    Write-Host
}

function Start-NChat {
    Write-ColorText "💬 Starting N-Chat..." -Color "Magenta"
    Stop-AppPort -Port 3003 -AppName "N-Chat"
    Clear-AppCache -AppPath "C:\nexus\apps\n-chat" -AppName "N-Chat"
    
    Write-ColorText "🚀 Launching N-Chat on port 3003..." -Color "Green"
    Set-Location "C:\nexus\apps\n-chat"
    & npx next dev --port 3003
}

function Start-CRM {
    Write-ColorText "🏢 Starting CRM System..." -Color "Cyan"
    Stop-AppPort -Port 3004 -AppName "CRM System"
    Clear-AppCache -AppPath "C:\nexus\apps\crm-system" -AppName "CRM System"
    
    Write-ColorText "🚀 Launching CRM System on port 3004..." -Color "Green"
    Set-Location "C:\nexus\apps\crm-system"
    & npm run dev
}

function Start-Both {
    Write-ColorText "🚀 Starting both applications..." -Color "Cyan"
    Write-Host
    
    # Stop existing processes
    Stop-AppPort -Port 3003 -AppName "N-Chat"
    Stop-AppPort -Port 3004 -AppName "CRM System"
    
    # Clear caches
    Clear-AppCache -AppPath "C:\nexus\apps\n-chat" -AppName "N-Chat"
    Clear-AppCache -AppPath "C:\nexus\apps\crm-system" -AppName "CRM System"
    
    Write-ColorText "⏳ Starting applications in 3 seconds..." -Color "Yellow"
    Start-Sleep -Seconds 3
    
    # Start N-Chat in background
    Write-ColorText "💬 Starting N-Chat in background..." -Color "Magenta"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'C:\nexus\apps\n-chat'; npx next dev --port 3003" -WindowStyle Normal
    
    Start-Sleep -Seconds 3
    
    # Start CRM in current window
    Write-ColorText "🏢 Starting CRM System..." -Color "Cyan"
    Set-Location "C:\nexus\apps\crm-system"
    & npm run dev
}

function Stop-All {
    Write-ColorText "🛑 Stopping all applications..." -Color "Red"
    Stop-AppPort -Port 3003 -AppName "N-Chat"
    Stop-AppPort -Port 3004 -AppName "CRM System"
    Write-ColorText "✅ All applications stopped" -Color "Green"
}

function Show-Menu {
    Write-Host
    Write-ColorText "📋 Choose Action / اختر العملية:" -Color "Cyan"
    Write-Host
    Write-ColorText "    [1] Start Both Apps    - شغل كلا التطبيقين" -Color "White"
    Write-ColorText "    [2] Start N-Chat       - شغل N-Chat" -Color "White"
    Write-ColorText "    [3] Start CRM System   - شغل CRM System" -Color "White"
    Write-ColorText "    [4] Stop All           - أوقف الكل" -Color "White"
    Write-ColorText "    [5] Check Status       - فحص الحالة" -Color "White"
    Write-ColorText "    [6] Clear All Cache    - نظف الكاش" -Color "White"
    Write-ColorText "    [0] Exit               - خروج" -Color "White"
    Write-Host
}

function Execute-Action {
    param([int]$ActionNum)
    
    switch ($ActionNum) {
        1 { Start-Both }
        2 { Start-NChat }
        3 { Start-CRM }
        4 { Stop-All; Read-Host "Press Enter to continue..." }
        5 { Show-Status; Read-Host "Press Enter to continue..." }
        6 { 
            Clear-AppCache -AppPath "C:\nexus\apps\n-chat" -AppName "N-Chat"
            Clear-AppCache -AppPath "C:\nexus\apps\crm-system" -AppName "CRM System"
            Read-Host "Press Enter to continue..."
        }
        0 { 
            Write-ColorText "👋 Goodbye! وداعاً!" -Color "Green"
            exit 0
        }
        default {
            Write-ColorText "❌ Invalid choice!" -Color "Red"
            Start-Sleep -Seconds 1
        }
    }
}

# Main Logic
try {
    if ($Action -gt 0) {
        Show-Header
        Execute-Action -ActionNum $Action
        exit 0
    }
    
    # Interactive mode
    do {
        Show-Header
        Show-Status
        Show-Menu
        
        try {
            $choice = Read-Host "Enter choice (0-6)"
            $choiceNum = [int]$choice
            Execute-Action -ActionNum $choiceNum
        } catch {
            Write-ColorText "❌ Please enter a valid number!" -Color "Red"
            Start-Sleep -Seconds 1
        }
        
    } while ($true)
    
} catch {
    Write-ColorText "❌ Error: $_" -Color "Red"
    Read-Host "Press Enter to exit..."
    exit 1
}