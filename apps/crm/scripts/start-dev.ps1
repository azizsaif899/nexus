# ====================================================================
# CRM Nxs - Development Startup Script (PowerShell)
# ====================================================================
# الوصف: سكريبت شامل لتشغيل بيئة التطوير بشكل احترافي
# الميزات:
#   ✅ تنظيف المنافذ المستخدمة
#   ✅ تنظيف الكاش والمجلدات المؤقتة
#   ✅ تثبيت التبعيات تلقائياً
#   ✅ تشغيل التطبيق
#   ✅ فتح المتصفح تلقائياً
#   ✅ تحليل الأخطاء إن وجدت
# ====================================================================

# Set UTF-8 encoding for proper Arabic display
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Colors for better UX
$ErrorColor = "Red"
$SuccessColor = "Green"
$InfoColor = "Cyan"
$WarningColor = "Yellow"

# Configuration
$PORT = 5173
$WORKSPACE_ROOT = "C:\nexus"                # Update this path - Nx workspace root
$APP_NAME = "CRM"                           # The app name in workspace
$BROWSER_URL = "http://localhost:$PORT"

# ====================================================================
# Helper Functions
# ====================================================================

function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Print-Header {
    Clear-Host
    Write-ColorOutput $InfoColor @"
╔════════════════════════════════════════════════════════════════╗
║                     🚀 CRM Nxs Startup Script                  ║
║                      Professional Edition v1.0                 ║
╚════════════════════════════════════════════════════════════════╝
"@
    Write-Host ""
}

function Print-Step {
    param([string]$message)
    Write-ColorOutput $InfoColor "`n▶ $message"
    Write-Host ""
}

function Print-Success {
    param([string]$message)
    Write-ColorOutput $SuccessColor "  ✅ $message"
}

function Print-Error {
    param([string]$message)
    Write-ColorOutput $ErrorColor "  ❌ $message"
}

function Print-Warning {
    param([string]$message)
    Write-ColorOutput $WarningColor "  ⚠️  $message"
}

function Print-Info {
    param([string]$message)
    Write-ColorOutput $InfoColor "  ℹ️  $message"
}

# ====================================================================
# Step 1: Kill processes on port
# ====================================================================

function Kill-ProcessOnPort {
    param([int]$port)
    
    Print-Step "Step 1: Checking for processes on port $port..."
    
    try {
        $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | 
                   Select-Object -ExpandProperty OwningProcess -First 1
        
        if ($process) {
            Print-Warning "Process found on port $port (PID: $process)"
            Stop-Process -Id $process -Force -ErrorAction Stop
            Start-Sleep -Seconds 1
            Print-Success "Port $port is now free"
        } else {
            Print-Success "Port $port is already free"
        }
    } catch {
        Print-Warning "Could not check/kill process on port $port"
        Print-Info "This is usually not a problem if the port is free"
    }
}

# ====================================================================
# Step 2: Navigate to project directory
# ====================================================================

function Navigate-ToProject {
    Print-Step "Step 2: Navigating to workspace root..."
    
    if (Test-Path $WORKSPACE_ROOT) {
        Set-Location $WORKSPACE_ROOT
        Print-Success "Current directory: $WORKSPACE_ROOT"
        
        # Check if app exists
        $appPath = Join-Path $WORKSPACE_ROOT "apps\$APP_NAME"
        if (!(Test-Path $appPath)) {
            Print-Error "App directory not found: $appPath"
            Print-Info "Please update the APP_NAME variable in this script"
            Read-Host "Press Enter to exit"
            exit 1
        }
        Print-Success "App found: apps\$APP_NAME"
    } else {
        Print-Error "Workspace root not found: $WORKSPACE_ROOT"
        Print-Info "Please update the WORKSPACE_ROOT variable in this script"
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# ====================================================================
# Step 3: Clean cache and temporary files
# ====================================================================

function Clean-Cache {
    Print-Step "Step 3: Cleaning cache and temporary files..."
    
    $foldersToClean = @(
        "node_modules/.cache",
        "node_modules/.vite",
        ".nx/cache",
        "dist",
        "apps\$APP_NAME\.vite",
        "apps\$APP_NAME\dist"
    )
    
    foreach ($folder in $foldersToClean) {
        if (Test-Path $folder) {
            try {
                Remove-Item -Path $folder -Recurse -Force -ErrorAction Stop
                Print-Success "Cleaned: $folder"
            } catch {
                Print-Warning "Could not clean: $folder (may not exist or in use)"
            }
        }
    }
    
    Print-Success "Cache cleanup completed"
}

# ====================================================================
# Step 4: Install/Update dependencies
# ====================================================================

function Install-Dependencies {
    Print-Step "Step 4: Checking and installing dependencies..."
    
    if (!(Test-Path "node_modules")) {
        Print-Info "node_modules not found. Installing all dependencies..."
        npm install
        
        if ($LASTEXITCODE -eq 0) {
            Print-Success "Dependencies installed successfully"
        } else {
            Print-Error "Failed to install dependencies"
            Print-Info "Run 'npm install' manually to see detailed errors"
            Read-Host "Press Enter to continue anyway"
        }
    } else {
        Print-Success "node_modules exists. Checking for updates..."
        npm install
        
        if ($LASTEXITCODE -eq 0) {
            Print-Success "Dependencies are up to date"
        } else {
            Print-Warning "There were issues updating dependencies"
            Print-Info "Continuing with existing dependencies..."
        }
    }
}

# ====================================================================
# Step 5: Check for common issues
# ====================================================================

function Check-CommonIssues {
    Print-Step "Step 5: Checking for common issues..."
    
    # Check if package.json exists
    if (!(Test-Path "package.json")) {
        Print-Error "package.json not found!"
        Print-Info "Make sure you're in the correct project directory"
        return $false
    }
    
    # Check if vite.config.ts exists
    if (!(Test-Path "vite.config.ts")) {
        Print-Warning "vite.config.ts not found"
        Print-Info "This might cause issues with Vite"
    }
    
    # Check Node version
    $nodeVersion = node --version
    Print-Info "Node.js version: $nodeVersion"
    
    # Check npm version
    $npmVersion = npm --version
    Print-Info "npm version: $npmVersion"
    
    Print-Success "Pre-flight checks completed"
    return $true
}

# ====================================================================
# Step 6: Start development server
# ====================================================================

function Start-DevServer {
    Print-Step "Step 6: Starting development server..."
    
    Print-Info "Starting Nx dev server for $APP_NAME on port $PORT..."
    Print-Info "Press Ctrl+C to stop the server"
    Write-Host ""
    Write-ColorOutput $SuccessColor @"
╔════════════════════════════════════════════════════════════════╗
║                   🎉 Server Starting...                        ║
║                                                                ║
║   App:     $APP_NAME (Nx Workspace)                            ║
║   Local:   http://localhost:$PORT                              ║
║   Network: Check terminal output below                        ║
║                                                                ║
║   Press Ctrl+C to stop the server                             ║
╚════════════════════════════════════════════════════════════════╝
"@
    Write-Host ""
    
    # Wait a bit before opening browser
    Start-Sleep -Seconds 2
    
    # Open browser
    Start-Process $BROWSER_URL
    Print-Success "Browser opened at $BROWSER_URL"
    Write-Host ""
    
    # Start the dev server using Nx (this will block until Ctrl+C)
    nx serve $APP_NAME
}

# ====================================================================
# Error Analysis Function
# ====================================================================

function Analyze-Error {
    param([string]$errorMessage)
    
    Print-Step "Analyzing error..."
    
    $commonErrors = @{
        "EADDRINUSE" = @{
            "description" = "Port is already in use"
            "solution" = "Run this script again to kill the process on the port"
        }
        "MODULE_NOT_FOUND" = @{
            "description" = "Missing dependencies"
            "solution" = "Delete node_modules and run: npm install"
        }
        "EACCES" = @{
            "description" = "Permission denied"
            "solution" = "Run PowerShell as Administrator"
        }
        "ERR_PNPM_NO_MATCHING_VERSION" = @{
            "description" = "Package version conflict"
            "solution" = "Check package.json for conflicting versions"
        }
    }
    
    foreach ($key in $commonErrors.Keys) {
        if ($errorMessage -match $key) {
            Print-Error "Error Type: $($commonErrors[$key].description)"
            Print-Info "Solution: $($commonErrors[$key].solution)"
            return
        }
    }
    
    Print-Warning "Unknown error type"
    Print-Info "Check the error message above for details"
}

# ====================================================================
# Main Execution
# ====================================================================

function Main {
    try {
        Print-Header
        
        # Step 1: Kill processes on port
        Kill-ProcessOnPort -port $PORT
        
        # Step 2: Navigate to project
        Navigate-ToProject
        
        # Step 3: Clean cache
        Clean-Cache
        
        # Step 4: Install dependencies
        Install-Dependencies
        
        # Step 5: Pre-flight checks
        $checksPass = Check-CommonIssues
        
        if (!$checksPass) {
            Print-Error "Pre-flight checks failed"
            Read-Host "Press Enter to exit"
            exit 1
        }
        
        # Step 6: Start server
        Start-DevServer
        
    } catch {
        Write-Host ""
        Print-Error "An error occurred during startup"
        Write-Host ""
        Write-ColorOutput $ErrorColor $_.Exception.Message
        Write-Host ""
        
        Analyze-Error -errorMessage $_.Exception.Message
        
        Write-Host ""
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Run the script
Main
