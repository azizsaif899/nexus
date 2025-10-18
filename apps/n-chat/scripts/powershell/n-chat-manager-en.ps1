# N-Chat PowerShell Management Script - English Only
param(
    [string]$Command = ""
)

# Set console encoding and title
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
    Write-Host "=============================================================" -ForegroundColor $Blue
    Write-Host ""
}

function Show-Menu {
    Write-Host "Available Tasks:" -ForegroundColor $Cyan
    Write-Host ""
    Write-Host "  [check]      Check Port 3003 Status" -ForegroundColor $Green
    Write-Host "  [kill]       Kill Port 3003 Processes" -ForegroundColor $Green
    Write-Host "  [clear]      Clear Cache Files" -ForegroundColor $Green
    Write-Host "  [dev]        Start Development Server" -ForegroundColor $Green
    Write-Host "  [prod]       Start Production Server" -ForegroundColor $Green
    Write-Host "  [clean]      Clean and Start" -ForegroundColor $Green
    Write-Host "  [restart]    Full Restart" -ForegroundColor $Green
    Write-Host "  [type]       TypeScript Check" -ForegroundColor $Green
    Write-Host "  [build]      Build Project" -ForegroundColor $Green
    Write-Host "  [install]    Install Packages" -ForegroundColor $Green
    Write-Host "  [status]     System Status" -ForegroundColor $Green
    Write-Host "  [exit]       Exit" -ForegroundColor $Green
    Write-Host ""
}

function Set-WorkingDirectory {
    $scriptPath = "C:\nexus\apps\n-chat"
    if (Test-Path $scriptPath) {
        Set-Location $scriptPath
        Write-Host "Working directory: $scriptPath" -ForegroundColor $Green
    }
    else {
        Write-Host "N-Chat directory not found: $scriptPath" -ForegroundColor $Red
        exit 1
    }
}

function Invoke-NpmScript {
    param([string]$ScriptName)
    
    Write-Host "Running: npm run $ScriptName" -ForegroundColor $Yellow
    try {
        & npm run $ScriptName
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Successfully executed $ScriptName" -ForegroundColor $Green
        }
        else {
            Write-Host "Failed to execute $ScriptName" -ForegroundColor $Red
        }
    }
    catch {
        Write-Host "Error executing $ScriptName : $($_.Exception.Message)" -ForegroundColor $Red
    }
}

function Show-SystemStatus {
    Write-Host "System Status:" -ForegroundColor $Cyan
    Write-Host ""
    
    # Check current directory
    $currentPath = Get-Location
    Write-Host "Current Directory: $currentPath" -ForegroundColor $Blue
    
    # Check package.json
    if (Test-Path "package.json") {
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        Write-Host "Project Name: $($packageJson.name)" -ForegroundColor $Blue
        Write-Host "Version: $($packageJson.version)" -ForegroundColor $Blue
        Write-Host "Next.js: $($packageJson.dependencies.next)" -ForegroundColor $Blue
        Write-Host "React: $($packageJson.dependencies.react)" -ForegroundColor $Blue
    }
    
    # Check port 3003
    Write-Host ""
    Write-Host "Checking Port 3003..." -ForegroundColor $Yellow
    try {
        $portCheck = netstat -an | Select-String ":3003"
        if ($portCheck) {
            Write-Host "Port 3003 is in use" -ForegroundColor $Yellow
        }
        else {
            Write-Host "Port 3003 is available" -ForegroundColor $Green
        }
    }
    catch {
        Write-Host "Error checking port" -ForegroundColor $Red
    }
    
    # Check important files
    Write-Host ""
    Write-Host "Important Files:" -ForegroundColor $Cyan
    $files = @("package.json", "next.config.js", "tailwind.config.js", "tsconfig.json")
    foreach ($file in $files) {
        if (Test-Path $file) {
            Write-Host "  Found: $file" -ForegroundColor $Green
        }
        else {
            Write-Host "  Missing: $file" -ForegroundColor $Red
        }
    }
}

function Start-InteractiveMode {
    while ($true) {
        Show-Header
        Show-Menu
        
        $userInput = Read-Host "Enter command"
        
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
                Write-Host "Installing packages..." -ForegroundColor $Yellow
                & npm install --legacy-peer-deps
            }
            "status" { Show-SystemStatus }
            "exit" { 
                Write-Host "Goodbye!" -ForegroundColor $Green
                exit 0 
            }
            default { 
                Write-Host "Unknown command!" -ForegroundColor $Red 
            }
        }
        
        Write-Host ""
        Write-Host "Press any key to continue..."
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
            Write-Host "Unknown command: $Command" -ForegroundColor $Red
            Show-Menu
        }
    }
}