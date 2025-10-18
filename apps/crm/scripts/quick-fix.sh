#!/bin/bash

# ====================================================================
# CRM Nxs - Quick Fix Script (Bash)
# ====================================================================
# الوصف: حل سريع للمشاكل الشائعة
# ====================================================================

export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8

CYAN='\033[0;36m'
GREEN='\033[0;32m'
NC='\033[0m'

clear
echo -e "${CYAN}"
cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                  🔧 CRM Nxs Quick Fix Tool                     ║
║               Fixing Common Issues Automatically...           ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

WORKSPACE_ROOT="/path/to/nexus"
cd "$WORKSPACE_ROOT" || exit 1

# Fix 1: Kill processes on common ports
echo -e "${CYAN}▶ Fix 1: Freeing ports...${NC}"
ports=(5173 3000 4200)
for port in "${ports[@]}"; do
    if command -v lsof &> /dev/null; then
        pid=$(lsof -ti:$port 2>/dev/null)
        if [ ! -z "$pid" ]; then
            kill -9 $pid 2>/dev/null
            echo -e "${GREEN}  ✅ Freed port $port${NC}"
        fi
    fi
done

# Fix 2: Clear Nx cache
echo -e "\n${CYAN}▶ Fix 2: Clearing Nx cache...${NC}"
if [ -d ".nx" ]; then
    rm -rf ".nx"
    echo -e "${GREEN}  ✅ Cleared Nx cache${NC}"
fi

# Fix 3: Clear node_modules cache
echo -e "\n${CYAN}▶ Fix 3: Clearing node_modules cache...${NC}"
if [ -d "node_modules/.cache" ]; then
    rm -rf "node_modules/.cache"
    echo -e "${GREEN}  ✅ Cleared node_modules cache${NC}"
fi

# Fix 4: Reset package-lock
echo -e "\n${CYAN}▶ Fix 4: Resetting package-lock...${NC}"
if [ -f "package-lock.json" ]; then
    rm "package-lock.json"
    npm install
    echo -e "${GREEN}  ✅ Regenerated package-lock.json${NC}"
fi

# Fix 5: Clear npm cache
echo -e "\n${CYAN}▶ Fix 5: Clearing npm cache...${NC}"
npm cache clean --force
echo -e "${GREEN}  ✅ Cleared npm cache${NC}"

echo ""
echo -e "${GREEN}"
cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                   ✅ Quick Fix Complete!                       ║
║                                                                ║
║   Try running: ./scripts/start-dev.sh                          ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
read -p "Press Enter to exit..."
