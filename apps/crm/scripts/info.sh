#!/bin/bash

# ====================================================================
# CRM Nxs - Project Info Script (Bash)
# ====================================================================
# الوصف: عرض معلومات شاملة عن المشروع
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
║                  📊 CRM Nxs Project Information                ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# System Information
echo -e "${YELLOW}=== System Information ===${NC}"
echo ""
echo "  🖥️  OS: $(uname -s)"
echo "  📦 Node.js: $(node --version)"
echo "  📦 npm: v$(npm --version)"
echo "  📦 Shell: $SHELL"

# Project Structure
echo ""
echo -e "${YELLOW}=== Project Structure ===${NC}"
echo ""
echo "  📁 Workspace Root: /path/to/nexus"
echo "  📁 CRM App: /path/to/nexus/apps/CRM"
echo "  📁 Scripts: /path/to/nexus/scripts"

# File Counts
echo ""
echo -e "${YELLOW}=== Project Statistics ===${NC}"
echo ""

tsx_files=$(find apps/CRM -name "*.tsx" 2>/dev/null | wc -l)
ts_files=$(find apps/CRM -name "*.ts" 2>/dev/null | wc -l)
css_files=$(find apps/CRM -name "*.css" 2>/dev/null | wc -l)

echo "  📄 TSX Files: $tsx_files"
echo "  📄 TS Files: $ts_files"
echo "  🎨 CSS Files: $css_files"

# Git Information
echo ""
echo -e "${YELLOW}=== Git Information ===${NC}"
echo ""

git_branch=$(git branch --show-current 2>/dev/null)
git_commits=$(git rev-list --count HEAD 2>/dev/null)

if [ ! -z "$git_branch" ]; then
    echo "  🌿 Current Branch: $git_branch"
    echo "  📝 Total Commits: $git_commits"
else
    echo "  ℹ️  Not a git repository"
fi

# Available Scripts
echo ""
echo -e "${YELLOW}=== Available Scripts ===${NC}"
echo ""
echo "  🚀 start-dev.sh     - Start development server"
echo "  🧹 clean.sh         - Deep clean cache and temp files"
echo "  📦 build.sh         - Build for production"
echo "  🧪 test.sh          - Run tests and linting"
echo "  📊 info.sh          - Show this information"

echo ""
echo -e "${GREEN}"
cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                   ✅ Information Complete                      ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
read -p "Press Enter to exit..."
