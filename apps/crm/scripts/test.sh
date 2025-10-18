#!/bin/bash

# ====================================================================
# CRM Nxs - Test & Lint Script (Bash)
# ====================================================================
# الوصف: تشغيل الاختبارات والـ linting
# ====================================================================

export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

clear
echo -e "${CYAN}"
cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                     🧪 CRM Nxs Test Suite                      ║
║                   Running Tests & Linting...                  ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Configuration
WORKSPACE_ROOT="/path/to/nexus"
APP_NAME="CRM"

# Navigate to workspace
cd "$WORKSPACE_ROOT" || exit 1

# Run TypeScript check
echo -e "${CYAN}▶ Step 1: TypeScript Type Check...${NC}"
tsc --noEmit

if [ $? -eq 0 ]; then
    echo -e "${GREEN}  ✅ TypeScript check passed${NC}"
else
    echo -e "${YELLOW}  ⚠️  TypeScript check found issues${NC}"
fi

# Run Lint
echo -e "\n${CYAN}▶ Step 2: ESLint Check...${NC}"
nx lint $APP_NAME

if [ $? -eq 0 ]; then
    echo -e "${GREEN}  ✅ Lint check passed${NC}"
else
    echo -e "${YELLOW}  ⚠️  Lint check found issues${NC}"
fi

# Run Tests (if available)
echo -e "\n${CYAN}▶ Step 3: Running Tests...${NC}"
nx test $APP_NAME

if [ $? -eq 0 ]; then
    echo -e "${GREEN}  ✅ All tests passed${NC}"
else
    echo -e "${YELLOW}  ⚠️  Some tests failed${NC}"
fi

echo ""
echo -e "${GREEN}"
cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                   ✅ Test Suite Complete                       ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
read -p "Press Enter to exit..."
