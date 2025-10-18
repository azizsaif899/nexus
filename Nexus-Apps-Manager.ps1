param([int]$Action = 0)

$Host.UI.RawUI.WindowTitle = "Nexus Apps Manager"

function Show-Header {
    Clear-Host
    Write-Host "=" * 60 -ForegroundColor Cyan
    Write-Host "    Nexus Applications Manager" -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Cyan
    Write-Host
}

function Test-AppPort {
    param([int]$Port)
    try {
        $result = netstat -ano | findstr ":$Port"
        return ($null -ne $result -and $result.Length -gt 0)
    } catch {
        return $false
    }
}

function Stop-AppPort {
    param([int]$Port, [string]$AppName)
    Write-Host "Stopping $AppName on port $Port..." -ForegroundColor Yellow
    
    try {
        $result = netstat -ano | findstr ":$Port"
        if ($result) {
            foreach ($line in $result) {
                $parts = $line.Trim() -split '\s+'
                if ($parts.Length -ge 5) {
                    $processId = $parts[4]
                    taskkill /PID $processId /F 2>$null
                    Write-Host "Stopped process $processId" -ForegroundColor Green
                }
            }
        } else {
            Write-Host "No processes found on port $Port" -ForegroundColor Blue
        }
    } catch {
        Write-Host "Error stopping port: $_" -ForegroundColor Red
    }
}

function Clear-AppCache {
    param([string]$AppPath, [string]$AppName)
    Write-Host "Clearing $AppName cache..." -ForegroundColor Blue 
    
    $currentDir = Get-Location
    try {
        Set-Location $AppPath
        
        $folders = @(".next", ".swc", "dist", "build")
        foreach ($folder in $folders) {
            if (Test-Path $folder) {
                Remove-Item $folder -Recurse -Force -ErrorAction SilentlyContinue
                Write-Host "Deleted $folder" -ForegroundColor Green
            }
        }
        
        npm cache clean --force 2>$null
        Write-Host "Cache cleared for $AppName" -ForegroundColor Green
    } catch {
        Write-Host "Some cache files could not be cleared" -ForegroundColor Yellow
    } finally {
        Set-Location $currentDir
    }
}

function Show-Status {
    Write-Host "Applications Status:" -ForegroundColor Cyan
    Write-Host
    
    Write-Host "N-Chat (Port 3003):" -ForegroundColor Magenta
    if (Test-AppPort -Port 3003) {
        Write-Host "  Status: RUNNING" -ForegroundColor Green
    } else {
        Write-Host "  Status: STOPPED" -ForegroundColor Red
    }
    Write-Host "  Path: C:\nexus\apps\n-chat" -ForegroundColor Blue
    
    Write-Host
    
    Write-Host "CRM System (Port 3004):" -ForegroundColor Cyan
    if (Test-AppPort -Port 3004) {
        Write-Host "  Status: RUNNING" -ForegroundColor Green
    } else {
        Write-Host "  Status: STOPPED" -ForegroundColor Red  
    }
    Write-Host "  Path: C:\nexus\apps\crm-system" -ForegroundColor Blue
    Write-Host
}

function Start-NChat {
    Write-Host "Starting N-Chat..." -ForegroundColor Magenta
    Stop-AppPort -Port 3003 -AppName "N-Chat"
    Clear-AppCache -AppPath "C:\nexus\apps\n-chat" -AppName "N-Chat"
    
    Write-Host "Launching N-Chat on port 3003..." -ForegroundColor Green
    Set-Location "C:\nexus\apps\n-chat"
    npx next dev --port 3003
}

function Start-CRM {
    Write-Host "Starting CRM System..." -ForegroundColor Cyan
    Stop-AppPort -Port 3004 -AppName "CRM System"
    Clear-AppCache -AppPath "C:\nexus\apps\crm-system" -AppName "CRM System"
    
    Write-Host "Launching CRM System on port 3004..." -ForegroundColor Green
    Set-Location "C:\nexus\apps\crm-system"
    npm run dev
}

function Start-Both {
    Write-Host "Starting both applications..." -ForegroundColor Cyan
    Write-Host
    
    Stop-AppPort -Port 3003 -AppName "N-Chat"
    Stop-AppPort -Port 3004 -AppName "CRM System"
    
    Clear-AppCache -AppPath "C:\nexus\apps\n-chat" -AppName "N-Chat"
    Clear-AppCache -AppPath "C:\nexus\apps\crm-system" -AppName "CRM System"
    
    Write-Host "Starting applications in 3 seconds..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
    
    Write-Host "Starting N-Chat in background..." -ForegroundColor Magenta
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'C:\nexus\apps\n-chat'; npx next dev --port 3003" -WindowStyle Normal
    
    Start-Sleep -Seconds 3
    
    Write-Host "Starting CRM System..." -ForegroundColor Cyan
    Set-Location "C:\nexus\apps\crm-system"
    npm run dev
}

function Stop-All {
    Write-Host "Stopping all applications..." -ForegroundColor Red
    Stop-AppPort -Port 3003 -AppName "N-Chat"
    Stop-AppPort -Port 3004 -AppName "CRM System"
    Write-Host "All applications stopped" -ForegroundColor Green
}

function Show-Menu {
    Write-Host
    Write-Host "Choose Action:" -ForegroundColor Cyan
    Write-Host
    Write-Host "    [1] Start Both Apps" -ForegroundColor White
    Write-Host "    [2] Start N-Chat" -ForegroundColor White
    Write-Host "    [3] Start CRM System" -ForegroundColor White
    Write-Host "    [4] Stop All" -ForegroundColor White
    Write-Host "    [5] Check Status" -ForegroundColor White
    Write-Host "    [6] Clear All Cache" -ForegroundColor White
    Write-Host "    [0] Exit" -ForegroundColor White
    Write-Host
}

function Invoke-UserAction {
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
            Write-Host "Goodbye!" -ForegroundColor Green
            exit 0
        }
        default {
            Write-Host "Invalid choice!" -ForegroundColor Red
            Start-Sleep -Seconds 1
        }
    }
}

try {
    if ($Action -gt 0) {
        Show-Header
        Invoke-UserAction -ActionNum $Action
        exit 0
    }
    
    do {
        Show-Header
        Show-Status
        Show-Menu
        
        try {
            $choice = Read-Host "Enter choice (0-6)"
            $choiceNum = [int]$choice
            Invoke-UserAction -ActionNum $choiceNum
        } catch {
            Write-Host "Please enter a valid number!" -ForegroundColor Red
            Start-Sleep -Seconds 1
        }
        
    } while ($true)
    
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}