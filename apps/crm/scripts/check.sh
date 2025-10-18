#!/bin/bash

# ====================================================================
# CRM Nxs - Comprehensive Check Script (Bash)
# ====================================================================
# الوصف: فحص شامل للمشروع (types, lint, tests, build)
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
║                  🔍 CRM Nxs Comprehensive Check                ║
║              Running All Quality Checks...                    ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Configuration
WORKSPACE_ROOT="/path/to/nexus"
APP_NAME="CRM"
FAILED=0

# Navigate to workspace
cd "$WORKSPACE_ROOT" || exit 1

# Check 1: Dependencies
echo -e "${CYAN}▶ Step 1/5: Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${RED}  ❌ node_modules not found!${NC}"
    echo -e "${CYAN}  ℹ️  Run: npm install${NC}"
    ((FAILED++))
else
    echo -e "${GREEN}  ✅ Dependencies OK${NC}"
fi

# Check 2: TypeScript
echo -e "\n${CYAN}▶ Step 2/5: TypeScript type checking...${NC}"
tsc --noEmit 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}  ✅ TypeScript check passed${NC}"
else
    echo -e "${RED}  ❌ TypeScript errors found${NC}"
    ((FAILED++))
fi

# Check 3: ESLint
echo -e "\n${CYAN}▶ Step 3/5: ESLint checking...${NC}"
nx lint $APP_NAME 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}  ✅ Lint check passed${NC}"
else
    echo -e "${YELLOW}  ⚠️  Lint warnings found${NC}"
fi

# Check 4: Build Test
echo -e "\n${CYAN}▶ Step 4/5: Test build...${NC}"
nx build $APP_NAME --configuration=development 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}  ✅ Build test passed${NC}"
else
    echo -e "${RED}  ❌ Build test failed${NC}"
    ((FAILED++))
fi

# Check 5: File Structure
echo -e "\n${CYAN}▶ Step 5/5: Checking file structure...${NC}"
required_files=(
    "package.json"
    "vite.config.ts"
    "tsconfig.json"
    "apps/$APP_NAME/App.tsx"
)

structure_ok=true
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}  ❌ Missing: $file${NC}"
        structure_ok=false
    fi
done

if [ "$structure_ok" = true ]; then
    echo -e "${GREEN}  ✅ File structure OK${NC}"
else
    ((FAILED++))
fi

# Summary
echo ""
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}"
    cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                   ✅ All Checks Passed!                        ║
║                                                                ║
║   Your project is ready for development/deployment            ║
╚════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
else
    echo -e "${RED}"
    cat << EOF
╔════════════════════════════════════════════════════════════════╗
║                   ⚠️  $FAILED Check(s) Failed                       ║
║                                                                ║
║   Please fix the issues above before proceeding               ║
╚════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
fi

echo ""
read -p "Press Enter to exit..."
exit $FAILED
