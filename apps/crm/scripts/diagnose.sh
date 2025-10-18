#!/bin/bash

# ====================================================================
# CRM Nxs - Comprehensive Diagnostic Script (Bash)
# ====================================================================
# الوصف: فحص تشخيصي شامل للمشروع (Dependencies, Config, Structure)
# ====================================================================

export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8

CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

clear
echo -e "${CYAN}"
cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║              🔍 CRM Nxs Diagnostic Tool v1.0                   ║
║           Comprehensive Project Health Check                  ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

WORKSPACE_ROOT="/path/to/nexus"
APP_NAME="CRM"
ISSUES_FOUND=0
WARNINGS_FOUND=0

cd "$WORKSPACE_ROOT" || exit 1

# ====================================================================
# Diagnostic 1: Environment Check
# ====================================================================

echo -e "${CYAN}═══ 1. Environment Check ═══${NC}"
echo ""

# Node.js version
if command -v node &> /dev/null; then
    node_version=$(node --version)
    node_major=$(echo "$node_version" | sed 's/v\([0-9]*\).*/\1/')
    if [ "$node_major" -ge 18 ]; then
        echo -e "${GREEN}  ✅ Node.js: $node_version (OK)${NC}"
    else
        echo -e "${YELLOW}  ⚠️  Node.js: $node_version (Recommended: v18+)${NC}"
        ((WARNINGS_FOUND++))
    fi
else
    echo -e "${RED}  ❌ Node.js not found!${NC}"
    ((ISSUES_FOUND++))
fi

# npm version
if command -v npm &> /dev/null; then
    npm_version=$(npm --version)
    echo -e "${GREEN}  ✅ npm: v$npm_version${NC}"
else
    echo -e "${RED}  ❌ npm not found!${NC}"
    ((ISSUES_FOUND++))
fi

# Nx version
if command -v nx &> /dev/null; then
    nx_version=$(nx --version)
    echo -e "${GREEN}  ✅ Nx: $nx_version${NC}"
else
    echo -e "${YELLOW}  ⚠️  Nx not found globally (npx will be used)${NC}"
    ((WARNINGS_FOUND++))
fi

echo ""

# ====================================================================
# Diagnostic 2: Project Structure
# ====================================================================

echo -e "${CYAN}═══ 2. Project Structure Check ═══${NC}"
echo ""

critical_files=(
    "package.json"
    "nx.json"
    "vite.config.ts"
    "tsconfig.json"
    "apps/$APP_NAME/App.tsx"
    "apps/$APP_NAME/index.html"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}  ✅ $file${NC}"
    else
        echo -e "${RED}  ❌ Missing: $file${NC}"
        ((ISSUES_FOUND++))
    fi
done

echo ""

# ====================================================================
# Diagnostic 3: Dependencies Check
# ====================================================================

echo -e "${CYAN}═══ 3. Dependencies Check ═══${NC}"
echo ""

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}  ✅ node_modules exists${NC}"
    
    pkg_count=$(find node_modules -maxdepth 1 -type d | wc -l)
    echo -e "${CYAN}  📦 Installed packages: $pkg_count${NC}"
else
    echo -e "${RED}  ❌ node_modules not found!${NC}"
    echo -e "${CYAN}  ℹ️  Run: npm install${NC}"
    ((ISSUES_FOUND++))
fi

# Check for package-lock.json
if [ -f "package-lock.json" ]; then
    echo -e "${GREEN}  ✅ package-lock.json exists${NC}"
else
    echo -e "${YELLOW}  ⚠️  package-lock.json not found${NC}"
    ((WARNINGS_FOUND++))
fi

# Check for problematic dependencies
echo ""
echo -e "${CYAN}  Checking for version issues...${NC}"

if [ -f "package.json" ]; then
    has_latest=$(grep -o '"latest"' package.json | wc -l)
    
    if [ "$has_latest" -eq 0 ]; then
        echo -e "${GREEN}  ✅ No 'latest' tags found${NC}"
    else
        echo -e "${RED}  ❌ Found $has_latest 'latest' tags in package.json!${NC}"
        ((ISSUES_FOUND++))
    fi
fi

echo ""

# ====================================================================
# Diagnostic 4: Configuration Files
# ====================================================================

echo -e "${CYAN}═══ 4. Configuration Files Check ═══${NC}"
echo ""

# TypeScript config
if [ -f "tsconfig.json" ]; then
    echo -e "${GREEN}  ✅ tsconfig.json exists${NC}"
    if python3 -m json.tool tsconfig.json > /dev/null 2>&1 || jq empty tsconfig.json > /dev/null 2>&1; then
        echo -e "${GREEN}  ✅ tsconfig.json is valid JSON${NC}"
    else
        echo -e "${RED}  ❌ tsconfig.json has syntax errors!${NC}"
        ((ISSUES_FOUND++))
    fi
else
    echo -e "${RED}  ❌ tsconfig.json not found!${NC}"
    ((ISSUES_FOUND++))
fi

# Vite config
if [ -f "vite.config.ts" ]; then
    echo -e "${GREEN}  ✅ vite.config.ts exists${NC}"
else
    echo -e "${RED}  ❌ vite.config.ts not found!${NC}"
    ((ISSUES_FOUND++))
fi

# PostCSS config
if [ -f "postcss.config.js" ]; then
    echo -e "${GREEN}  ✅ postcss.config.js exists${NC}"
else
    echo -e "${YELLOW}  ⚠️  postcss.config.js not found${NC}"
    ((WARNINGS_FOUND++))
fi

# Tailwind config
if [ -f "tailwind.config.js" ]; then
    echo -e "${GREEN}  ✅ tailwind.config.js exists${NC}"
else
    echo -e "${YELLOW}  ⚠️  tailwind.config.js not found${NC}"
    ((WARNINGS_FOUND++))
fi

echo ""

# ====================================================================
# Diagnostic 5: Port Availability
# ====================================================================

echo -e "${CYAN}═══ 5. Port Availability Check ═══${NC}"
echo ""

ports=(5173 3000 4200 4173)
for port in "${ports[@]}"; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}  ⚠️  Port $port is in use${NC}"
        ((WARNINGS_FOUND++))
    else
        echo -e "${GREEN}  ✅ Port $port is available${NC}"
    fi
done

echo ""

# ====================================================================
# Diagnostic 6: Build Artifacts
# ====================================================================

echo -e "${CYAN}═══ 6. Build Artifacts Check ═══${NC}"
echo ""

artifact_dirs=(".nx/cache" "dist" "node_modules/.vite" "node_modules/.cache")
total_size=0

for dir in "${artifact_dirs[@]}"; do
    if [ -d "$dir" ]; then
        size=$(du -sm "$dir" 2>/dev/null | cut -f1)
        total_size=$((total_size + size))
        echo -e "${CYAN}  📁 $dir: ${size} MB${NC}"
    fi
done

if [ "$total_size" -gt 500 ]; then
    echo -e "${YELLOW}  ⚠️  Large cache size: ${total_size} MB${NC}"
    echo -e "${CYAN}  ℹ️  Consider running: ./scripts/clean.sh${NC}"
    ((WARNINGS_FOUND++))
else
    echo -e "${GREEN}  ✅ Cache size: ${total_size} MB (OK)${NC}"
fi

echo ""

# ====================================================================
# Diagnostic 7: Git Status
# ====================================================================

echo -e "${CYAN}═══ 7. Git Repository Check ═══${NC}"
echo ""

if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${GREEN}  ✅ Git repository detected${NC}"
    
    branch=$(git branch --show-current 2>/dev/null)
    echo -e "${CYAN}  🌿 Current branch: $branch${NC}"
    
    uncommitted=$(git status --porcelain 2>/dev/null | wc -l)
    if [ "$uncommitted" -gt 0 ]; then
        echo -e "${YELLOW}  ⚠️  Uncommitted changes: $uncommitted files${NC}"
        ((WARNINGS_FOUND++))
    else
        echo -e "${GREEN}  ✅ Working directory clean${NC}"
    fi
else
    echo -e "${CYAN}  ℹ️  Not a git repository${NC}"
fi

echo ""

# ====================================================================
# Diagnostic 8: npm Audit
# ====================================================================

echo -e "${CYAN}═══ 8. Security Audit ═══${NC}"
echo ""

if [ -d "node_modules" ]; then
    echo -e "${CYAN}  Running npm audit...${NC}"
    audit_output=$(npm audit --json 2>/dev/null)
    
    if echo "$audit_output" | grep -q '"total":'; then
        total=$(echo "$audit_output" | grep -o '"total":[0-9]*' | head -1 | cut -d: -f2)
        
        if [ "$total" -eq 0 ]; then
            echo -e "${GREEN}  ✅ No vulnerabilities found${NC}"
        else
            echo -e "${RED}  ❌ Security issues found: $total vulnerabilities${NC}"
            echo -e "${CYAN}  ℹ️  Run: npm audit fix${NC}"
            ((WARNINGS_FOUND++))
        fi
    fi
else
    echo -e "${YELLOW}  ⚠️  Skipped (node_modules not found)${NC}"
fi

echo ""

# ====================================================================
# Summary Report
# ====================================================================

echo ""
echo -e "${CYAN}═══ Diagnostic Summary ═══${NC}"
echo ""

if [ "$ISSUES_FOUND" -eq 0 ] && [ "$WARNINGS_FOUND" -eq 0 ]; then
    echo -e "${GREEN}"
    cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                   ✅ All Checks Passed!                        ║
║                                                                ║
║   Your project is healthy and ready to go!                    ║
╚════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
elif [ "$ISSUES_FOUND" -eq 0 ]; then
    echo -e "${YELLOW}"
    cat << EOF
╔════════════════════════════════════════════════════════════════╗
║                   ⚠️  $WARNINGS_FOUND Warning(s) Found                      ║
║                                                                ║
║   Project is functional but has minor issues                  ║
╚════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
else
    echo -e "${RED}"
    cat << EOF
╔════════════════════════════════════════════════════════════════╗
║          ❌ $ISSUES_FOUND Critical Issue(s) + $WARNINGS_FOUND Warning(s)              ║
║                                                                ║
║   Please fix the issues above before proceeding               ║
╚════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
fi

echo ""

# Recommendations
if [ "$ISSUES_FOUND" -gt 0 ] || [ "$WARNINGS_FOUND" -gt 0 ]; then
    echo -e "${CYAN}📋 Recommended Actions:${NC}"
    echo ""
    
    if [ "$ISSUES_FOUND" -gt 0 ]; then
        echo -e "${RED}  Critical:${NC}"
        echo "  1. Fix missing files/configurations"
        echo "  2. Run: npm install"
        echo "  3. Run this diagnostic again"
        echo ""
    fi
    
    if [ "$WARNINGS_FOUND" -gt 0 ]; then
        echo -e "${YELLOW}  Maintenance:${NC}"
        echo "  1. Run: ./scripts/clean.sh (if cache is large)"
        echo "  2. Run: npm audit fix (if vulnerabilities found)"
        echo "  3. Consider updating outdated packages"
        echo ""
    fi
fi

echo -e "${CYAN}💡 Quick Commands:${NC}"
echo "  • Full setup: ./scripts/clean.sh && npm install"
echo "  • Start dev: ./scripts/start-dev.sh"
echo "  • Run tests: ./scripts/check.sh"
echo ""

read -p "Press Enter to exit..."
exit $ISSUES_FOUND
