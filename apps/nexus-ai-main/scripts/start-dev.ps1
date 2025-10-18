#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Safe development server startup for Nexus AI
.DESCRIPTION
    Kills any existing processes on port 3000, cleans cache, and starts the development server
.PARAMETER Port
    Port number to use (default: 3000)
.PARAMETER Clean
    Force clean cache before starting
.EXAMPLE
    .\start-dev.ps1
.EXAMPLE
    .\start-dev.ps1 -Port 5173 -Clean
#>

param(
    [int]$Port = 3000,
    [switch]$Clean
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Colors for output
$Green = "Green"
$Cyan = "Cyan"
$Yellow = "Yellow"
$Red = "Red"
$Magenta = "Magenta"

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Test-PortFree {
    param([int]$Port)
    $connections = netstat -ano | findstr ":$Port"
    return [string]::IsNullOrEmpty($connections)
}

function Kill-ProcessOnPort {
    param([int]$Port)
    Write-ColorOutput "🔍 Checking for processes on port $Port..." $Cyan

    $connections = netstat -ano | findstr ":$Port"
    if ($connections) {
        Write-ColorOutput "⚠️  Found processes on port $Port, attempting to kill..." $Yellow

        $pids = $connections | ForEach-Object {
            $parts = $_ -split '\s+'
            $parts[-1]
        } | Where-Object { $_ -and $_ -ne "0" } | Select-Object -Unique

        foreach ($pid in $pids) {
            try {
                Write-ColorOutput "🛑 Killing process $pid..." $Red
                taskkill /PID $pid /F /T 2>$null
                Start-Sleep -Seconds 1
            }
            catch {
                Write-ColorOutput "⚠️  Could not kill process $pid (may require admin privileges)" $Yellow
            }
        }
    }
    else {
        Write-ColorOutput "✅ Port $Port is free" $Green
    }
}

function Clean-Cache {
    Write-ColorOutput "🧹 Cleaning cache..." $Cyan

    # Clean Vite cache
    if (Test-Path "node_modules/.vite") {
        Remove-Item -Recurse -Force "node_modules/.vite" -ErrorAction SilentlyContinue
        Write-ColorOutput "✅ Vite cache cleaned" $Green
    }

    # Clean npm cache
    try {
        npm cache clean --force 2>$null
        Write-ColorOutput "✅ NPM cache cleaned" $Green
    }
    catch {
        Write-ColorOutput "⚠️  Could not clean npm cache" $Yellow
    }

    # Clean dist folder
    if (Test-Path "dist") {
        Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
        Write-ColorOutput "✅ Dist folder cleaned" $Green
    }
}

function Install-Dependencies {
    Write-ColorOutput "📦 Checking dependencies..." $Cyan

    if (-not (Test-Path "node_modules")) {
        Write-ColorOutput "📥 Installing dependencies..." $Yellow
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to install dependencies"
        }
        Write-ColorOutput "✅ Dependencies installed" $Green
    }
    else {
        Write-ColorOutput "✅ Dependencies already installed" $Green
    }
}

function Start-DevelopmentServer {
    param([int]$Port)

    Write-ColorOutput "🚀 Starting development server on port $Port..." $Magenta

    # Check if we can use npm run dev or need to use npx vite directly
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    $hasDevScript = $packageJson.scripts -and $packageJson.scripts.dev

    if ($hasDevScript) {
        Write-ColorOutput "📜 Using npm run dev" $Cyan
        npm run dev -- --port $Port --host
    }
    else {
        Write-ColorOutput "📜 Using npx vite directly" $Cyan
        npx vite --port $Port --host
    }
}

# Main execution
try {
    Write-ColorOutput "🔧 Nexus AI - Safe Development Startup" $Cyan
    Write-ColorOutput "=====================================" $Cyan
    Write-ColorOutput ""

    # Change to script directory if not already there
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $projectRoot = Split-Path -Parent $scriptDir
    Set-Location $projectRoot

    Write-ColorOutput "📁 Working directory: $(Get-Location)" $Cyan

    # Kill existing processes
    Kill-ProcessOnPort -Port $Port

    # Clean cache if requested
    if ($Clean) {
        Clean-Cache
    }

    # Install dependencies
    Install-Dependencies

    # Verify port is free
    if (-not (Test-PortFree -Port $Port)) {
        throw "Port $Port is still in use after cleanup attempts"
    }

    # Start the server
    Start-DevelopmentServer -Port $Port

}
catch {
    Write-ColorOutput "❌ Error: $($_.Exception.Message)" $Red
    Write-ColorOutput "💡 Try running as administrator or check port usage" $Yellow
    exit 1
}