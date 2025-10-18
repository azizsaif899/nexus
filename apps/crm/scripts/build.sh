#!/bin/bash

# ====================================================================
# CRM Nxs - Production Build Script (Bash)
# ====================================================================
# الوصف: بناء التطبيق للإنتاج مع التحسينات
# ====================================================================

export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8

CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

clear
echo -e "${CYAN}"
cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                  📦 CRM Nxs Production Build                   ║
║                      Building for Production...                ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Configuration
WORKSPACE_ROOT="/path/to/nexus"
APP_NAME="CRM"

# Navigate to workspace
echo -e "${CYAN}▶ Navigating to workspace...${NC}"
cd "$WORKSPACE_ROOT" || exit 1

# Clean previous builds
echo -e "\n${CYAN}▶ Cleaning previous builds...${NC}"
if [ -d "dist" ]; then
    rm -rf "dist"
    echo -e "${GREEN}  ✅ Cleaned dist folder${NC}"
fi

# Build the application
echo -e "\n${CYAN}▶ Building application...${NC}"
nx build $APP_NAME --prod

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}"
    cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                   ✅ Build Successful!                         ║
║                                                                ║
║   Output: dist/apps/CRM                                       ║
║   Ready for deployment                                        ║
╚════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
else
    echo ""
    echo -e "${RED}"
    cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                   ❌ Build Failed!                             ║
║                                                                ║
║   Check the error messages above                              ║
╚════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    exit 1
fi

echo ""
read -p "Press Enter to exit..."
