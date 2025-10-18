#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Comprehensive Nexus AI development environment setup and startup
.DESCRIPTION
    Performs full diagnostics, cleanup, dependency installation, and starts the development server
.PARAMETER Port
    Port number to use (default: 3000)
.PARAMETER SkipClean
    Skip cache cleaning
.PARAMETER SkipInstall
    Skip dependency installation
.PARAMETER Force
    Force operations without prompts
.EXAMPLE
    .\comprehensive-start.ps1
.EXAMPLE
    .\comprehensive-start.ps1 -Port 5173 -Force
#>

param(
    [int]$Port = 3000,
    [switch]$SkipClean,
    [switch]$SkipInstall,
    [switch]$Force
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Colors for output
$Green = "Green"
$Cyan = "Cyan"
$Yellow = "Yellow"
$Red = "Red"
$Magenta = "Magenta"
$White = "White"

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-Step {
    param([string]$Step, [string]$Description)
    Write-Host ""
    Write-ColorOutput "🔄 Step $($Step): $Description" $Cyan
    Write-ColorOutput ("=" * (8 + $Step.Length + $Description.Length)) $Cyan
}

function Test-SystemRequirements {
    Write-Step "1" "Checking System Requirements"

    $requirements = @(
        @{ Name = "Node.js"; Command = "node --version" },
        @{ Name = "NPM"; Command = "npm --version" },
        @{ Name = "Git"; Command = "git --version" }
    )

    $allGood = $true

    foreach ($req in $requirements) {
        try {
            $result = Invoke-Expression $req.Command 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-ColorOutput "  ✅ $($req.Name): $($result.Trim())" $Green
            }
            else {
                Write-ColorOutput "  ❌ $($req.Name): Command failed" $Red
                $allGood = $false
            }
        }
        catch {
            Write-ColorOutput "  ❌ $($req.Name): Not found" $Red
            $allGood = $false
        }
    }

    if (-not $allGood) {
        throw "System requirements not met. Please install missing components."
    }

    Write-ColorOutput "  🎉 All system requirements satisfied!" $Green
    return $true
}

function Invoke-Diagnostics {
    Write-Step "2" "Running Diagnostics"

    # Check project structure
    $requiredFiles = @(
        "package.json",
        "vite.config.ts",
        "tsconfig.json",
        "index.html",
        "src/main.tsx",
        "src/App.tsx"
    )

    $structureGood = $true

    foreach ($file in $requiredFiles) {
        if (Test-Path $file) {
            Write-ColorOutput "  ✅ $file" $Green
        }
        else {
            Write-ColorOutput "  ❌ $file - Missing" $Red
            $structureGood = $false
        }
    }

    if (-not $structureGood) {
        throw "Project structure incomplete. Some required files are missing."
    }

    # Check port availability
    $connections = netstat -ano | findstr ":$Port"
    if ($connections) {
        Write-ColorOutput "  ⚠️  Port $Port is in use. Will attempt to free it." $Yellow
    }
    else {
        Write-ColorOutput "  ✅ Port $Port is available" $Green
    }

    Write-ColorOutput "  🎉 Diagnostics completed successfully!" $Green
    return $true
}

function Invoke-Cleanup {
    param([switch]$SkipClean)

    if ($SkipClean) {
        Write-Step "3" "Skipping Cleanup (as requested)"
        return $true
    }

    Write-Step "3" "Performing Cleanup"

    $cleanedItems = 0
    $totalItems = 0

    # Clean directories
    $dirsToClean = @(
        "node_modules/.vite",
        "dist",
        "coverage",
        ".nyc_output",
        "node_modules/.cache"
    )

    foreach ($dir in $dirsToClean) {
        $totalItems++
        if (Test-Path $dir) {
            try {
                Remove-Item -Recurse -Force $dir -ErrorAction Stop
                Write-ColorOutput "  ✅ Cleaned $dir" $Green
                $cleanedItems++
            }
            catch {
                Write-ColorOutput "  ❌ Failed to clean $dir" $Red
            }
        }
        else {
            Write-ColorOutput "  ℹ️  $dir not found" $Cyan
            $cleanedItems++
        }
    }

    # Clean caches
    $totalItems += 2

    try {
        npm cache clean --force 2>$null
        Write-ColorOutput "  ✅ NPM cache cleaned" $Green
        $cleanedItems++
    }
    catch {
        Write-ColorOutput "  ❌ NPM cache clean failed" $Red
    }

    if (Test-Command "yarn") {
        try {
            yarn cache clean 2>$null
            Write-ColorOutput "  ✅ Yarn cache cleaned" $Green
            $cleanedItems++
        }
        catch {
            Write-ColorOutput "  ❌ Yarn cache clean failed" $Red
        }
    }
    else {
        Write-ColorOutput "  ℹ️  Yarn not available" $Cyan
        $cleanedItems++
    }

    Write-ColorOutput "  📊 Cleanup: $cleanedItems/$totalItems items processed" $Green
    return $true
}

function Install-Dependencies {
    param([switch]$SkipInstall)

    if ($SkipInstall) {
        Write-Step "4" "Skipping Dependency Installation (as requested)"
        return $true
    }

    Write-Step "4" "Installing Dependencies"

    if (-not (Test-Path "node_modules")) {
        Write-ColorOutput "  📦 Installing dependencies..." $Yellow
        try {
            npm install
            if ($LASTEXITCODE -ne 0) {
                throw "npm install failed"
            }
            Write-ColorOutput "  ✅ Dependencies installed successfully" $Green
        }
        catch {
            Write-ColorOutput "  ❌ Dependency installation failed" $Red
            throw "Failed to install dependencies: $($_.Exception.Message)"
        }
    }
    else {
        Write-ColorOutput "  ✅ Dependencies already installed" $Green
    }

    return $true
}

function Test-TypeScriptCompilation {
    Write-Step "5" "Testing TypeScript Compilation"

    try {
        Write-ColorOutput "  🔨 Running TypeScript compilation check..." $Cyan
        $result = npx tsc --noEmit 2>&1

        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "  ✅ TypeScript compilation successful" $Green
            return $true
        }
        else {
            Write-ColorOutput "  ❌ TypeScript compilation failed" $Red
            Write-ColorOutput "  📄 Errors found:" $Red

            # Show first few errors
            $errorLines = $result -split "`n" | Where-Object { $_ -match "error" } | Select-Object -First 5
            foreach ($line in $errorLines) {
                Write-ColorOutput "    $line" $Red
            }

            if (($result -split "`n").Count -gt 5) {
                Write-ColorOutput "    ... and more errors" $Red
            }

            throw "TypeScript compilation failed"
        }
    }
    catch {
        if ($_.Exception.Message -notlike "*TypeScript compilation failed*") {
            Write-ColorOutput "  ❌ TypeScript check failed to run" $Red
            throw "TypeScript check failed: $($_.Exception.Message)"
        }
        else {
            throw
        }
    }
}

function Start-DevelopmentServer {
    param([int]$Port)

    Write-Step "6" "Starting Development Server"

    # Kill any existing processes on the port
    Write-ColorOutput "  🔍 Checking port $Port..." $Cyan
    $connections = netstat -ano | findstr ":$Port"
    if ($connections) {
        Write-ColorOutput "  🛑 Killing existing processes on port $Port..." $Yellow

        $pids = $connections | ForEach-Object {
            $parts = $_ -split '\s+'
            $parts[-1]
        } | Where-Object { $_ -and $_ -ne "0" } | Select-Object -Unique

        foreach ($pid in $pids) {
            try {
                taskkill /PID $pid /F /T 2>$null
                Write-ColorOutput "  ✅ Killed process $pid" $Green
            }
            catch {
                Write-ColorOutput "  ⚠️  Could not kill process $pid" $Yellow
            }
        }

        # Wait a moment for port to be freed
        Start-Sleep -Seconds 2
    }

    # Start the development server
    Write-ColorOutput "  🚀 Starting Nexus AI development server..." $Magenta
    Write-ColorOutput "  📍 Port: $Port" $Cyan
    Write-ColorOutput "  🌐 URL: http://localhost:$Port" $Cyan
    Write-Host ""

    try {
        # Use npm run dev if available, otherwise npx vite
        $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
        if ($packageJson.scripts -and $packageJson.scripts.dev) {
            Write-ColorOutput "  📜 Using npm run dev" $Cyan
            npm run dev -- --port $Port --host
        }
        else {
            Write-ColorOutput "  📜 Using npx vite directly" $Cyan
            npx vite --port $Port --host
        }
    }
    catch {
        Write-ColorOutput "  ❌ Failed to start development server" $Red
        throw "Server startup failed: $($_.Exception.Message)"
    }
}

function Test-Command {
    param([string]$Command)
    try {
        $null = Get-Command $Command -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

function Show-Success {
    Write-Host ""
    Write-ColorOutput "🎉 Nexus AI Development Environment Ready!" $Green
    Write-ColorOutput "=" * 45 $Green
    Write-ColorOutput "✅ System requirements checked" $Green
    Write-ColorOutput "✅ Project diagnostics completed" $Green
    Write-ColorOutput "✅ Cache and temp files cleaned" $Green
    Write-ColorOutput "✅ Dependencies installed" $Green
    Write-ColorOutput "✅ TypeScript compilation verified" $Green
    Write-ColorOutput "✅ Development server started" $Green
    Write-Host ""
    Write-ColorOutput "🌐 Open your browser and visit: http://localhost:$Port" $Magenta
    Write-ColorOutput "🔧 Available scripts:" $Cyan
    Write-ColorOutput "   .\diagnose.ps1    - Run diagnostics" $White
    Write-ColorOutput "   .\clean.ps1       - Clean cache" $White
    Write-ColorOutput "   .\start-dev.ps1   - Quick server start" $White
    Write-Host ""
}

# Main execution
try {
    Write-ColorOutput "🚀 Nexus AI - Comprehensive Development Setup" $Magenta
    Write-ColorOutput "=============================================" $Magenta
    Write-Host ""

    # Change to script directory if not already there
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $projectRoot = Split-Path -Parent $scriptDir
    Set-Location $projectRoot

    Write-ColorOutput "📁 Working directory: $(Get-Location)" $Cyan
    Write-Host ""

    # Execute all steps
    Test-SystemRequirements
    Invoke-Diagnostics
    Invoke-Cleanup -SkipClean:$SkipClean
    Install-Dependencies -SkipInstall:$SkipInstall
    Test-TypeScriptCompilation
    Start-DevelopmentServer -Port $Port

    # This point should not be reached if server starts successfully
    Show-Success

}
catch {
    Write-Host ""
    Write-ColorOutput "❌ Setup failed at step: $($_.Exception.Message)" $Red
    Write-Host ""
    Write-ColorOutput "💡 Troubleshooting tips:" $Yellow
    Write-ColorOutput "   1. Run '.\diagnose.ps1' to check for issues" $White
    Write-ColorOutput "   2. Run '.\clean.ps1 -Deep' for complete cleanup" $White
    Write-ColorOutput "   3. Ensure Node.js and npm are properly installed" $White
    Write-ColorOutput "   4. Try running as administrator" $White
    Write-Host ""
    exit 1
}