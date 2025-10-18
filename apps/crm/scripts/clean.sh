#!/bin/bash

# ====================================================================
# CRM Nxs - Deep Clean Script (Bash)
# ====================================================================
# الوصف: تنظيف عميق لجميع الملفات المؤقتة والكاش
# الاستخدام: عندما تواجه مشاكل في البناء أو التشغيل
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
║                  🧹 CRM Nxs Deep Clean Script                  ║
║                     Cleaning Everything...                     ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Files and folders to clean
items_to_clean=(
    "node_modules"
    "node_modules/.cache"
    "node_modules/.vite"
    ".vite"
    "dist"
    "build"
    ".turbo"
    "package-lock.json"
    "yarn.lock"
    "pnpm-lock.yaml"
)

for item in "${items_to_clean[@]}"; do
    if [ -e "$item" ]; then
        echo -e "${CYAN}  Removing: $item${NC}"
        rm -rf "$item" 2>/dev/null
        echo -e "${GREEN}  ✅ Removed: $item${NC}"
    else
        echo -e "${YELLOW}  ⚠️  Not found: $item${NC}"
    fi
done

echo ""
echo -e "${CYAN}Clearing npm cache...${NC}"
npm cache clean --force

echo ""
echo -e "${GREEN}"
cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                   ✨ Clean Complete!                           ║
║                                                                ║
║   Next steps:                                                  ║
║   1. Run: npm install                                          ║
║   2. Run: npm run dev                                          ║
║                                                                ║
║   Or just run: ./scripts/start-dev.sh                          ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"
