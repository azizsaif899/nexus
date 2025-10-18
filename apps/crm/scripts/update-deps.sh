#!/bin/bash

# ====================================================================
# CRM Nxs - Update Dependencies Script (Bash)
# ====================================================================
# الوصف: تحديث التبعيات بأمان
# ====================================================================

export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

clear
echo -e "${CYAN}"
cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                  📦 CRM Nxs Update Dependencies                ║
║                  Updating packages safely...                  ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

WORKSPACE_ROOT="/path/to/nexus"
cd "$WORKSPACE_ROOT" || exit 1

# Backup package.json
echo -e "${CYAN}▶ Step 1: Creating backup...${NC}"
cp package.json package.json.backup
echo -e "${GREEN}  ✅ Backup created: package.json.backup${NC}"

# Show outdated packages
echo -e "\n${CYAN}▶ Step 2: Checking for outdated packages...${NC}"
npm outdated

# Ask for confirmation
echo ""
echo -e "${YELLOW}⚠️  This will update packages. Continue? (y/n)${NC}"
read -r response
if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo -e "${CYAN}  ℹ️  Update cancelled${NC}"
    rm package.json.backup
    exit 0
fi

# Update packages
echo -e "\n${CYAN}▶ Step 3: Updating packages...${NC}"
npm update

if [ $? -eq 0 ]; then
    echo -e "${GREEN}  ✅ Packages updated successfully${NC}"
else
    echo -e "${RED}  ❌ Update failed - restoring backup${NC}"
    cp package.json.backup package.json
    rm package.json.backup
    exit 1
fi

# Clean install
echo -e "\n${CYAN}▶ Step 4: Clean install...${NC}"
rm -rf node_modules
rm package-lock.json
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}  ✅ Clean install completed${NC}"
    rm package.json.backup
else
    echo -e "${RED}  ❌ Install failed - restoring backup${NC}"
    cp package.json.backup package.json
    rm package.json.backup
    exit 1
fi

echo ""
echo -e "${GREEN}"
cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                   ✅ Update Complete!                          ║
║                                                                ║
║   Run: ./scripts/check.sh to verify everything works          ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
read -p "Press Enter to exit..."
