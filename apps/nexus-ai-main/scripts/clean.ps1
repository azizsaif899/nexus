#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Clean cache and temporary files for Nexus AI development
.DESCRIPTION
    Removes cache files, temporary directories, and cleans package manager caches
.PARAMETER Deep
    Perform deep cleaning (removes node_modules)
.PARAMETER Force
    Skip confirmation prompts
.EXAMPLE
    .\clean.ps1
.EXAMPLE
    .\clean.ps1 -Deep -Force
#>

param(
    [switch]$Deep,
    [switch]$Force
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

function Remove-Directory {
    param(
        [string]$Path,
        [string]$Description
    )

    if (Test-Path $Path) {
        Write-ColorOutput "🗑️  Removing $Description..." $Yellow
        try {
            Remove-Item -Recurse -Force $Path -ErrorAction Stop
            Write-ColorOutput "✅ $Description removed" $Green
            return $true
        }
        catch {
            Write-ColorOutput "❌ Failed to remove $Description" $Red
            Write-ColorOutput "   Error: $($_.Exception.Message)" $Red
            return $false
        }
    }
    else {
        Write-ColorOutput "ℹ️  $Description not found (already clean)" $Cyan
        return $true
    }
}

function Clean-NpmCache {
    Write-ColorOutput "🧹 Cleaning NPM cache..." $Cyan
    try {
        npm cache clean --force 2>$null
        Write-ColorOutput "✅ NPM cache cleaned" $Green
        return $true
    }
    catch {
        Write-ColorOutput "❌ Failed to clean NPM cache" $Red
        return $false
    }
}

function Clean-YarnCache {
    if (Test-Command "yarn") {
        Write-ColorOutput "🧹 Cleaning Yarn cache..." $Cyan
        try {
            yarn cache clean 2>$null
            Write-ColorOutput "✅ Yarn cache cleaned" $Green
            return $true
        }
        catch {
            Write-ColorOutput "❌ Failed to clean Yarn cache" $Red
            return $false
        }
    }
    else {
        Write-ColorOutput "ℹ️  Yarn not found, skipping Yarn cache clean" $Cyan
        return $true
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

function Get-DirectorySize {
    param([string]$Path)
    if (Test-Path $Path) {
        try {
            $size = (Get-ChildItem -Recurse $Path | Measure-Object -Property Length -Sum).Sum
            $sizeMB = [math]::Round($size / 1MB, 2)
            return "$sizeMB MB"
        }
        catch {
            return "Unknown"
        }
    }
    return "0 MB"
}

# Main execution
Write-ColorOutput "🧹 Nexus AI - Cache Cleaner" $Cyan
Write-ColorOutput "===========================" $Cyan

# Change to script directory if not already there
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
Set-Location $projectRoot

Write-ColorOutput "📁 Working directory: $(Get-Location)" $Cyan
Write-Host ""

# Show current sizes
Write-ColorOutput "📊 Current directory sizes:" $Cyan
$nodeModulesSize = Get-DirectorySize "node_modules"
$distSize = Get-DirectorySize "dist"
$viteCacheSize = Get-DirectorySize "node_modules/.vite"

Write-ColorOutput "  node_modules: $nodeModulesSize" $Yellow
Write-ColorOutput "  dist: $distSize" $Yellow
Write-ColorOutput "  .vite cache: $viteCacheSize" $Yellow
Write-Host ""

# Confirm deep clean
if ($Deep -and -not $Force) {
    $confirmation = Read-Host "⚠️  Deep clean will remove node_modules. Continue? (y/N)"
    if ($confirmation -ne "y" -and $confirmation -ne "Y") {
        Write-ColorOutput "❌ Deep clean cancelled" $Yellow
        exit 0
    }
}

# Standard cleaning
Write-ColorOutput "🧽 Performing standard cleanup..." $Cyan
Write-Host ""

$successCount = 0
$totalOperations = 0

# Clean Vite cache
$totalOperations++
if (Remove-Directory "node_modules/.vite" "Vite cache") {
    $successCount++
}

# Clean dist directory
$totalOperations++
if (Remove-Directory "dist" "dist directory") {
    $successCount++
}

# Clean coverage reports
$totalOperations++
if (Remove-Directory "coverage" "coverage reports") {
    $successCount++
}

# Clean test results
$totalOperations++
if (Remove-Directory ".nyc_output" "test coverage data") {
    $successCount++
}

# Clean TypeScript cache
$totalOperations++
if (Remove-Directory "node_modules/.cache" "TypeScript cache") {
    $successCount++
}

# Clean logs
$totalOperations++
if (Remove-Directory "*.log" "log files") {
    $successCount++
}

# Clean OS temp files
$totalOperations++
if (Remove-Directory ".DS_Store" "macOS temp files") {
    $successCount++
}

# Clean NPM cache
$totalOperations++
if (Clean-NpmCache) {
    $successCount++
}

# Clean Yarn cache
$totalOperations++
if (Clean-YarnCache) {
    $successCount++
}

# Deep cleaning
if ($Deep) {
    Write-Host ""
    Write-ColorOutput "🔥 Performing deep cleanup..." $Magenta

    # Remove node_modules
    $totalOperations++
    if (Remove-Directory "node_modules" "node_modules directory") {
        $successCount++
    }

    # Remove package-lock.json
    $totalOperations++
    if (Remove-Directory "package-lock.json" "package-lock.json") {
        $successCount++
    }

    # Remove yarn.lock
    $totalOperations++
    if (Remove-Directory "yarn.lock" "yarn.lock") {
        $successCount++
    }
}

# Summary
Write-Host ""
Write-ColorOutput "📊 Cleanup Summary:" $Cyan
Write-ColorOutput "  ✅ Successful operations: $successCount/$totalOperations" $Green

if ($successCount -eq $totalOperations) {
    Write-ColorOutput "🎉 All cleanup operations completed successfully!" $Green
}
else {
    Write-ColorOutput "⚠️  Some cleanup operations failed. Check the output above." $Yellow
}

# Recommendations
Write-Host ""
Write-ColorOutput "💡 Next steps:" $Magenta
if ($Deep) {
    Write-ColorOutput "  1. Run 'npm install' to reinstall dependencies" $Cyan
}
Write-ColorOutput "  2. Run '.\start-dev.ps1' to start development server" $Cyan
Write-ColorOutput "  3. Run '.\diagnose.ps1' to verify everything is working" $Cyan