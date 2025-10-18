#!/bin/bash

# ====================================================================
# CRM Nxs - Preview Production Build (Bash)
# ====================================================================
# الوصف: معاينة البناء الإنتاجي محلياً
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
║                  👁️  CRM Nxs Preview Mode                      ║
║               Previewing Production Build...                  ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Configuration
WORKSPACE_ROOT="/path/to/nexus"
APP_NAME="CRM"
PORT=4173

# Navigate to workspace
cd "$WORKSPACE_ROOT" || exit 1

# Check if build exists
echo -e "${CYAN}▶ Checking for production build...${NC}"
if [ ! -d "dist/apps/$APP_NAME" ]; then
    echo -e "${RED}  ❌ Production build not found!${NC}"
    echo -e "${CYAN}  ℹ️  Run: ./scripts/build.sh first${NC}"
    read -p "Press Enter to exit..."
    exit 1
fi

echo -e "${GREEN}  ✅ Production build found${NC}"

# Start preview server
echo -e "\n${CYAN}▶ Starting preview server on port $PORT...${NC}"
echo ""
echo -e "${GREEN}"
cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                   🎉 Preview Server Starting...                ║
║                                                                ║
║   Local:   http://localhost:4173                              ║
║   Testing: Production build preview                           ║
║                                                                ║
║   Press Ctrl+C to stop                                        ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Open browser
sleep 2
if command -v open &> /dev/null; then
    open "http://localhost:$PORT"
elif command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:$PORT"
fi
echo -e "${GREEN}  ✅ Browser opened${NC}"
echo ""

# Start preview (Nx preview command)
nx run $APP_NAME:preview
