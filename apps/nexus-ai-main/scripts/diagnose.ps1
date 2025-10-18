#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Comprehensive diagnostics for Nexus AI development environment
.DESCRIPTION
    Runs various checks to diagnose potential issues with the development setup
.PARAMETER Port
    Port to check (default: 3000)
.PARAMETER Verbose
    Show detailed output
.EXAMPLE
    .\diagnose.ps1
.EXAMPLE
    .\diagnose.ps1 -Port 5173 -Verbose
#>

param(
    [int]$Port = 3000,
    [switch]$Verbose
)

# Set error action preference
$ErrorActionPreference = "Continue"

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

function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-ColorOutput "🔍 $Title" $Cyan
    Write-ColorOutput ("=" * ($Title.Length + 3)) $Cyan
}

function Test-Command {
    param([string]$Command, [string]$Description)
    try {
        $null = Get-Command $Command -ErrorAction Stop
        Write-ColorOutput "  ✅ $Description" $Green
        return $true
    }
    catch {
        Write-ColorOutput "  ❌ $Description - Not found" $Red
        return $false
    }
}

function Test-PortStatus {
    param([int]$Port)
    Write-ColorOutput "  🔍 Checking port $Port..." $Cyan

    $connections = netstat -ano | findstr ":$Port"
    if ($connections) {
        Write-ColorOutput "  ⚠️  Port $Port is in use:" $Yellow
        foreach ($line in $connections) {
            Write-ColorOutput "    $line" $Yellow
        }

        # Try to identify the process
        $pids = $connections | ForEach-Object {
            $parts = $_ -split '\s+'
            $parts[-1]
        } | Where-Object { $_ -and $_ -ne "0" } | Select-Object -Unique

        foreach ($pid in $pids) {
            try {
                $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
                if ($process) {
                    Write-ColorOutput "    Process: $($process.Name) (PID: $pid)" $Yellow
                }
            }
            catch {
                Write-ColorOutput "    Unknown process (PID: $pid)" $Yellow
            }
        }
    }
    else {
        Write-ColorOutput "  ✅ Port $Port is free" $Green
    }
}

function Test-FileExists {
    param([string]$Path, [string]$Description)
    if (Test-Path $Path) {
        Write-ColorOutput "  ✅ $Description" $Green
        return $true
    }
    else {
        Write-ColorOutput "  ❌ $Description - Missing" $Red
        return $false
    }
}

function Test-NodeVersion {
    try {
        $version = node --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "  ✅ Node.js: $version" $Green
            return $true
        }
    }
    catch {
        # Continue
    }
    Write-ColorOutput "  ❌ Node.js not found" $Red
    return $false
}

function Test-NpmVersion {
    try {
        $version = npm --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "  ✅ NPM: v$version" $Green
            return $true
        }
    }
    catch {
        # Continue
    }
    Write-ColorOutput "  ❌ NPM not found" $Red
    return $false
}

function Test-TypeScript {
    try {
        $result = npx tsc --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            $version = $result | Select-String -Pattern "Version (\d+\.\d+\.\d+)" | ForEach-Object { $_.Matches.Groups[1].Value }
            Write-ColorOutput "  ✅ TypeScript: v$version" $Green
            return $true
        }
    }
    catch {
        # Continue
    }
    Write-ColorOutput "  ❌ TypeScript not available" $Red
    return $false
}

function Test-Dependencies {
    Write-ColorOutput "  📦 Checking package.json..." $Cyan

    if (-not (Test-FileExists "package.json" "package.json")) {
        return $false
    }

    try {
        $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
        Write-ColorOutput "  ✅ package.json is valid JSON" $Green

        if ($Verbose) {
            Write-ColorOutput "  📊 Dependencies count: $($packageJson.dependencies.PSObject.Properties.Count)" $Cyan
            Write-ColorOutput "  📊 DevDependencies count: $($packageJson.devDependencies.PSObject.Properties.Count)" $Cyan
        }

        return $true
    }
    catch {
        Write-ColorOutput "  ❌ package.json is invalid JSON" $Red
        return $false
    }
}

function Test-NodeModules {
    if (Test-FileExists "node_modules" "node_modules directory") {
        # Check if key dependencies exist
        $keyDeps = @("react", "react-dom", "vite", "typescript")
        foreach ($dep in $keyDeps) {
            if (Test-Path "node_modules/$dep") {
                Write-ColorOutput "  ✅ $dep installed" $Green
            }
            else {
                Write-ColorOutput "  ❌ $dep missing" $Red
            }
        }
        return $true
    }
    return $false
}

function Test-ViteConfig {
    if (Test-FileExists "vite.config.ts" "vite.config.ts") {
        try {
            $content = Get-Content "vite.config.ts" -Raw
            if ($content -match "port:\s*$Port") {
                Write-ColorOutput "  ✅ Vite config has correct port ($Port)" $Green
            }
            else {
                Write-ColorOutput "  ⚠️  Vite config port may not match ($Port)" $Yellow
            }
            return $true
        }
        catch {
            Write-ColorOutput "  ❌ Cannot read vite.config.ts" $Red
        }
    }
    return $false
}

function Test-TypeScriptCompilation {
    Write-ColorOutput "  🔨 Testing TypeScript compilation..." $Cyan
    try {
        $result = npx tsc --noEmit 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "  ✅ TypeScript compilation successful" $Green
            return $true
        }
        else {
            Write-ColorOutput "  ❌ TypeScript compilation failed" $Red
            if ($Verbose) {
                Write-ColorOutput "  📄 Errors:" $Red
                $result | ForEach-Object { Write-ColorOutput "    $_" $Red }
            }
            return $false
        }
    }
    catch {
        Write-ColorOutput "  ❌ TypeScript check failed to run" $Red
        return $false
    }
}

function Test-NetworkConnectivity {
    Write-ColorOutput "  🌐 Testing network connectivity..." $Cyan

    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$Port" -TimeoutSec 5 -ErrorAction Stop
        Write-ColorOutput "  ✅ Local server responding on port $Port" $Green
        Write-ColorOutput "  📊 Status: $($response.StatusCode)" $Green
        return $true
    }
    catch {
        Write-ColorOutput "  ❌ No response from localhost:$Port" $Red
        Write-ColorOutput "  💡 Server may not be running" $Yellow
        return $false
    }
}

# Main execution
Write-ColorOutput "🔧 Nexus AI - Development Diagnostics" $Cyan
Write-ColorOutput "=====================================" $Cyan

# Change to script directory if not already there
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
Set-Location $projectRoot

Write-ColorOutput "📁 Working directory: $(Get-Location)" $Cyan
Write-Host ""

# System Requirements
Write-Section "System Requirements"
Test-Command "node" "Node.js"
Test-Command "npm" "NPM"
Test-Command "npx" "NPX"
Test-NodeVersion
Test-NpmVersion
Test-TypeScript

# Project Structure
Write-Section "Project Structure"
Test-FileExists "package.json" "package.json"
Test-FileExists "vite.config.ts" "vite.config.ts"
Test-FileExists "tsconfig.json" "tsconfig.json"
Test-FileExists "index.html" "index.html"
Test-FileExists "src" "src directory"
Test-FileExists "src/main.tsx" "src/main.tsx"
Test-FileExists "src/App.tsx" "src/App.tsx"

# Dependencies
Write-Section "Dependencies"
Test-Dependencies
Test-NodeModules

# Configuration
Write-Section "Configuration"
Test-ViteConfig

# Port Status
Write-Section "Port Status"
Test-PortStatus -Port $Port

# Compilation
Write-Section "TypeScript Compilation"
Test-TypeScriptCompilation

# Network
Write-Section "Network Connectivity"
Test-NetworkConnectivity

# Summary
Write-Section "Summary"
Write-ColorOutput "✅ Diagnostics completed" $Green
Write-ColorOutput "💡 Use '.\start-dev.ps1' to start the development server" $Magenta
Write-ColorOutput "💡 Use '.\clean.ps1' to clean cache if needed" $Magenta