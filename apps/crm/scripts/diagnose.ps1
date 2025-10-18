# ====================================================================
# CRM Nxs - Comprehensive Diagnostic Script (PowerShell)
# ====================================================================
# الوصف: فحص تشخيصي شامل للمشروع (Dependencies, Config, Structure)
# ====================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$InfoColor = "Cyan"
$SuccessColor = "Green"
$ErrorColor = "Red"
$WarningColor = "Yellow"

function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Clear-Host
Write-ColorOutput $InfoColor @"
╔════════════════════════════════════════════════════════════════╗
║              🔍 CRM Nxs Diagnostic Tool v1.0                   ║
║           Comprehensive Project Health Check                  ║
╚════════════════════════════════════════════════════════════════╝
"@
Write-Host ""

$WORKSPACE_ROOT = "C:\nexus"
$APP_NAME = "CRM"
$ISSUES_FOUND = 0
$WARNINGS_FOUND = 0

Set-Location $WORKSPACE_ROOT

# ====================================================================
# Diagnostic 1: Environment Check
# ====================================================================

Write-ColorOutput $InfoColor "═══ 1. Environment Check ═══"
Write-Host ""

# Node.js version
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    $nodeNum = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($nodeNum -ge 18) {
        Write-ColorOutput $SuccessColor "  ✅ Node.js: $nodeVersion (OK)"
    } else {
        Write-ColorOutput $WarningColor "  ⚠️  Node.js: $nodeVersion (Recommended: v18+)"
        $WARNINGS_FOUND++
    }
} else {
    Write-ColorOutput $ErrorColor "  ❌ Node.js not found!"
    $ISSUES_FOUND++
}

# npm version
$npmVersion = npm --version 2>$null
if ($npmVersion) {
    Write-ColorOutput $SuccessColor "  ✅ npm: v$npmVersion"
} else {
    Write-ColorOutput $ErrorColor "  ❌ npm not found!"
    $ISSUES_FOUND++
}

# Nx version
$nxVersion = nx --version 2>$null
if ($nxVersion) {
    Write-ColorOutput $SuccessColor "  ✅ Nx: $nxVersion"
} else {
    Write-ColorOutput $WarningColor "  ⚠️  Nx not found globally (npx will be used)"
    $WARNINGS_FOUND++
}

Write-Host ""

# ====================================================================
# Diagnostic 2: Project Structure
# ====================================================================

Write-ColorOutput $InfoColor "═══ 2. Project Structure Check ═══"
Write-Host ""

$criticalFiles = @(
    "package.json",
    "nx.json",
    "vite.config.ts",
    "tsconfig.json",
    "apps/$APP_NAME/App.tsx",
    "apps/$APP_NAME/index.html"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-ColorOutput $SuccessColor "  ✅ $file"
    } else {
        Write-ColorOutput $ErrorColor "  ❌ Missing: $file"
        $ISSUES_FOUND++
    }
}

Write-Host ""

# ====================================================================
# Diagnostic 3: Dependencies Check
# ====================================================================

Write-ColorOutput $InfoColor "═══ 3. Dependencies Check ═══"
Write-Host ""

# Check if node_modules exists
if (Test-Path "node_modules") {
    Write-ColorOutput $SuccessColor "  ✅ node_modules exists"
    
    # Count packages
    $pkgCount = (Get-ChildItem "node_modules" -Directory).Count
    Write-ColorOutput $InfoColor "  📦 Installed packages: $pkgCount"
} else {
    Write-ColorOutput $ErrorColor "  ❌ node_modules not found!"
    Write-ColorOutput $InfoColor "  ℹ️  Run: npm install"
    $ISSUES_FOUND++
}

# Check for package-lock.json
if (Test-Path "package-lock.json") {
    Write-ColorOutput $SuccessColor "  ✅ package-lock.json exists"
} else {
    Write-ColorOutput $WarningColor "  ⚠️  package-lock.json not found"
    $WARNINGS_FOUND++
}

# Check for problematic dependencies
Write-Host ""
Write-ColorOutput $InfoColor "  Checking for version issues..."

if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    
    # Check for "latest" tags
    $hasLatest = $false
    if ($packageJson.dependencies) {
        foreach ($dep in $packageJson.dependencies.PSObject.Properties) {
            if ($dep.Value -eq "latest") {
                Write-ColorOutput $ErrorColor "  ❌ Dependency '$($dep.Name)' uses 'latest' tag!"
                $ISSUES_FOUND++
                $hasLatest = $true
            }
        }
    }
    
    if ($packageJson.devDependencies) {
        foreach ($dep in $packageJson.devDependencies.PSObject.Properties) {
            if ($dep.Value -eq "latest") {
                Write-ColorOutput $ErrorColor "  ❌ DevDependency '$($dep.Name)' uses 'latest' tag!"
                $ISSUES_FOUND++
                $hasLatest = $true
            }
        }
    }
    
    if (!$hasLatest) {
        Write-ColorOutput $SuccessColor "  ✅ No 'latest' tags found"
    }
}

Write-Host ""

# ====================================================================
# Diagnostic 4: Configuration Files
# ====================================================================

Write-ColorOutput $InfoColor "═══ 4. Configuration Files Check ═══"
Write-Host ""

# TypeScript config
if (Test-Path "tsconfig.json") {
    Write-ColorOutput $SuccessColor "  ✅ tsconfig.json exists"
    try {
        Get-Content "tsconfig.json" | ConvertFrom-Json | Out-Null
        Write-ColorOutput $SuccessColor "  ✅ tsconfig.json is valid JSON"
    } catch {
        Write-ColorOutput $ErrorColor "  ❌ tsconfig.json has syntax errors!"
        $ISSUES_FOUND++
    }
} else {
    Write-ColorOutput $ErrorColor "  ❌ tsconfig.json not found!"
    $ISSUES_FOUND++
}

# Vite config
if (Test-Path "vite.config.ts") {
    Write-ColorOutput $SuccessColor "  ✅ vite.config.ts exists"
} else {
    Write-ColorOutput $ErrorColor "  ❌ vite.config.ts not found!"
    $ISSUES_FOUND++
}

# PostCSS config
if (Test-Path "postcss.config.js") {
    Write-ColorOutput $SuccessColor "  ✅ postcss.config.js exists"
} else {
    Write-ColorOutput $WarningColor "  ⚠️  postcss.config.js not found"
    $WARNINGS_FOUND++
}

# Tailwind config
if (Test-Path "tailwind.config.js") {
    Write-ColorOutput $SuccessColor "  ✅ tailwind.config.js exists"
} else {
    Write-ColorOutput $WarningColor "  ⚠️  tailwind.config.js not found"
    $WARNINGS_FOUND++
}

Write-Host ""

# ====================================================================
# Diagnostic 5: Port Availability
# ====================================================================

Write-ColorOutput $InfoColor "═══ 5. Port Availability Check ═══"
Write-Host ""

$ports = @(5173, 3000, 4200, 4173)
foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        Write-ColorOutput $WarningColor "  ⚠️  Port $port is in use"
        $WARNINGS_FOUND++
    } else {
        Write-ColorOutput $SuccessColor "  ✅ Port $port is available"
    }
}

Write-Host ""

# ====================================================================
# Diagnostic 6: Build Artifacts
# ====================================================================

Write-ColorOutput $InfoColor "═══ 6. Build Artifacts Check ═══"
Write-Host ""

$artifactDirs = @(".nx/cache", "dist", "node_modules/.vite", "node_modules/.cache")
$totalSize = 0

foreach ($dir in $artifactDirs) {
    if (Test-Path $dir) {
        $size = (Get-ChildItem $dir -Recurse -ErrorAction SilentlyContinue | 
                 Measure-Object -Property Length -Sum -ErrorAction SilentlyContinue).Sum / 1MB
        $totalSize += $size
        Write-ColorOutput $InfoColor "  📁 $dir`: $([math]::Round($size, 2)) MB"
    }
}

if ($totalSize -gt 500) {
    Write-ColorOutput $WarningColor "  ⚠️  Large cache size: $([math]::Round($totalSize, 2)) MB"
    Write-ColorOutput $InfoColor "  ℹ️  Consider running: .\scripts\clean.ps1"
    $WARNINGS_FOUND++
} else {
    Write-ColorOutput $SuccessColor "  ✅ Cache size: $([math]::Round($totalSize, 2)) MB (OK)"
}

Write-Host ""

# ====================================================================
# Diagnostic 7: Git Status
# ====================================================================

Write-ColorOutput $InfoColor "═══ 7. Git Repository Check ═══"
Write-Host ""

$gitStatus = git status 2>$null
if ($gitStatus) {
    Write-ColorOutput $SuccessColor "  ✅ Git repository detected"
    
    $branch = git branch --show-current 2>$null
    Write-ColorOutput $InfoColor "  🌿 Current branch: $branch"
    
    $uncommitted = git status --porcelain 2>$null
    if ($uncommitted) {
        $count = ($uncommitted | Measure-Object -Line).Lines
        Write-ColorOutput $WarningColor "  ⚠️  Uncommitted changes: $count files"
        $WARNINGS_FOUND++
    } else {
        Write-ColorOutput $SuccessColor "  ✅ Working directory clean"
    }
} else {
    Write-ColorOutput $InfoColor "  ℹ️  Not a git repository"
}

Write-Host ""

# ====================================================================
# Diagnostic 8: npm Audit
# ====================================================================

Write-ColorOutput $InfoColor "═══ 8. Security Audit ═══"
Write-Host ""

if (Test-Path "node_modules") {
    Write-ColorOutput $InfoColor "  Running npm audit..."
    $auditResult = npm audit --json 2>$null | ConvertFrom-Json
    
    if ($auditResult.metadata) {
        $vulnerabilities = $auditResult.metadata.vulnerabilities
        $total = $vulnerabilities.total
        
        if ($total -eq 0) {
            Write-ColorOutput $SuccessColor "  ✅ No vulnerabilities found"
        } else {
            $critical = $vulnerabilities.critical
            $high = $vulnerabilities.high
            $moderate = $vulnerabilities.moderate
            $low = $vulnerabilities.low
            
            if ($critical -gt 0 -or $high -gt 0) {
                Write-ColorOutput $ErrorColor "  ❌ Security issues found:"
                if ($critical -gt 0) {
                    Write-ColorOutput $ErrorColor "    • Critical: $critical"
                    $ISSUES_FOUND++
                }
                if ($high -gt 0) {
                    Write-ColorOutput $ErrorColor "    • High: $high"
                    $ISSUES_FOUND++
                }
            }
            if ($moderate -gt 0) {
                Write-ColorOutput $WarningColor "    • Moderate: $moderate"
                $WARNINGS_FOUND++
            }
            if ($low -gt 0) {
                Write-ColorOutput $InfoColor "    • Low: $low"
            }
            
            Write-ColorOutput $InfoColor "  ℹ️  Run: npm audit fix"
        }
    }
} else {
    Write-ColorOutput $WarningColor "  ⚠️  Skipped (node_modules not found)"
}

Write-Host ""

# ====================================================================
# Summary Report
# ====================================================================

Write-Host ""
Write-ColorOutput $InfoColor "═══ Diagnostic Summary ═══"
Write-Host ""

if ($ISSUES_FOUND -eq 0 -and $WARNINGS_FOUND -eq 0) {
    Write-ColorOutput $SuccessColor @"
╔════════════════════════════════════════════════════════════════╗
║                   ✅ All Checks Passed!                        ║
║                                                                ║
║   Your project is healthy and ready to go!                    ║
╚════════════════════════════════════════════════════════════════╝
"@
} elseif ($ISSUES_FOUND -eq 0) {
    Write-ColorOutput $WarningColor @"
╔════════════════════════════════════════════════════════════════╗
║                   ⚠️  $WARNINGS_FOUND Warning(s) Found                      ║
║                                                                ║
║   Project is functional but has minor issues                  ║
╚════════════════════════════════════════════════════════════════╝
"@
} else {
    Write-ColorOutput $ErrorColor @"
╔════════════════════════════════════════════════════════════════╗
║          ❌ $ISSUES_FOUND Critical Issue(s) + $WARNINGS_FOUND Warning(s)              ║
║                                                                ║
║   Please fix the issues above before proceeding               ║
╚════════════════════════════════════════════════════════════════╝
"@
}

Write-Host ""

# Recommendations
if ($ISSUES_FOUND -gt 0 -or $WARNINGS_FOUND -gt 0) {
    Write-ColorOutput $InfoColor "📋 Recommended Actions:"
    Write-Host ""
    
    if ($ISSUES_FOUND -gt 0) {
        Write-ColorOutput $ErrorColor "  Critical:"
        Write-Host "  1. Fix missing files/configurations"
        Write-Host "  2. Run: npm install"
        Write-Host "  3. Run this diagnostic again"
        Write-Host ""
    }
    
    if ($WARNINGS_FOUND -gt 0) {
        Write-ColorOutput $WarningColor "  Maintenance:"
        Write-Host "  1. Run: .\scripts\clean.ps1 (if cache is large)"
        Write-Host "  2. Run: npm audit fix (if vulnerabilities found)"
        Write-Host "  3. Consider updating outdated packages"
        Write-Host ""
    }
}

Write-ColorOutput $InfoColor "💡 Quick Commands:"
Write-Host "  • Full setup: .\scripts\clean.ps1 && npm install"
Write-Host "  • Start dev: .\scripts\start-dev.ps1"
Write-Host "  • Run tests: .\scripts\check.ps1"
Write-Host ""

Read-Host "Press Enter to exit"
exit $ISSUES_FOUND
