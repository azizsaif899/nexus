#!/bin/bash

# ====================================================================
# CRM Nxs - Development Startup Script (Bash)
# ====================================================================
# الوصف: سكريبت شامل لتشغيل بيئة التطوير بشكل احترافي
# الميزات:
#   ✅ تنظيف المنافذ المستخدمة
#   ✅ تنظيف الكاش والمجلدات المؤقتة
#   ✅ تثبيت التبعيات تلقائياً
#   ✅ تشغيل التطبيق
#   ✅ فتح المتصفح تلقائياً
#   ✅ تحليل الأخطاء إن وجدت
# ====================================================================

# Set UTF-8 encoding for proper Arabic display
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8

# Colors for better UX
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PORT=5173
PROJECT_DIR="/c/nexus/apps/CRM"  # Update this path
BROWSER_URL="http://localhost:$PORT"

# ====================================================================
# Helper Functions
# ====================================================================

print_header() {
    clear
    echo -e "${CYAN}"
    cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                     🚀 CRM Nxs Startup Script                  ║
║                      Professional Edition v1.0                 ║
╚════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

print_step() {
    echo -e "\n${CYAN}▶ $1${NC}\n"
}

print_success() {
    echo -e "  ${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "  ${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "  ${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "  ${CYAN}ℹ️  $1${NC}"
}

# ====================================================================
# Step 1: Kill processes on port
# ====================================================================

kill_process_on_port() {
    local port=$1
    
    print_step "Step 1: Checking for processes on port $port..."
    
    if command -v lsof &> /dev/null; then
        # macOS / Linux with lsof
        local pid=$(lsof -ti:$port 2>/dev/null)
        
        if [ ! -z "$pid" ]; then
            print_warning "Process found on port $port (PID: $pid)"
            kill -9 $pid 2>/dev/null
            sleep 1
            print_success "Port $port is now free"
        else
            print_success "Port $port is already free"
        fi
    elif command -v fuser &> /dev/null; then
        # Linux with fuser
        local pid=$(fuser $port/tcp 2>/dev/null)
        
        if [ ! -z "$pid" ]; then
            print_warning "Process found on port $port (PID: $pid)"
            fuser -k $port/tcp 2>/dev/null
            sleep 1
            print_success "Port $port is now free"
        else
            print_success "Port $port is already free"
        fi
    else
        print_warning "Could not check for processes (lsof/fuser not found)"
        print_info "This is usually not a problem if the port is free"
    fi
}

# ====================================================================
# Step 2: Navigate to project directory
# ====================================================================

navigate_to_project() {
    print_step "Step 2: Navigating to project directory..."
    
    if [ -d "$PROJECT_DIR" ]; then
        cd "$PROJECT_DIR" || exit 1
        print_success "Current directory: $PROJECT_DIR"
    else
        print_error "Project directory not found: $PROJECT_DIR"
        print_info "Please update the PROJECT_DIR variable in this script"
        read -p "Press Enter to exit..."
        exit 1
    fi
}

# ====================================================================
# Step 3: Clean cache and temporary files
# ====================================================================

clean_cache() {
    print_step "Step 3: Cleaning cache and temporary files..."
    
    local folders_to_clean=(
        "node_modules/.cache"
        "node_modules/.vite"
        ".vite"
        "dist"
    )
    
    for folder in "${folders_to_clean[@]}"; do
        if [ -d "$folder" ]; then
            rm -rf "$folder" 2>/dev/null
            if [ $? -eq 0 ]; then
                print_success "Cleaned: $folder"
            else
                print_warning "Could not clean: $folder (may not exist or in use)"
            fi
        fi
    done
    
    print_success "Cache cleanup completed"
}

# ====================================================================
# Step 4: Install/Update dependencies
# ====================================================================

install_dependencies() {
    print_step "Step 4: Checking and installing dependencies..."
    
    if [ ! -d "node_modules" ]; then
        print_info "node_modules not found. Installing all dependencies..."
        npm install
        
        if [ $? -eq 0 ]; then
            print_success "Dependencies installed successfully"
        else
            print_error "Failed to install dependencies"
            print_info "Run 'npm install' manually to see detailed errors"
            read -p "Press Enter to continue anyway..."
        fi
    else
        print_success "node_modules exists. Checking for updates..."
        npm install
        
        if [ $? -eq 0 ]; then
            print_success "Dependencies are up to date"
        else
            print_warning "There were issues updating dependencies"
            print_info "Continuing with existing dependencies..."
        fi
    fi
}

# ====================================================================
# Step 5: Check for common issues
# ====================================================================

check_common_issues() {
    print_step "Step 5: Checking for common issues..."
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_error "package.json not found!"
        print_info "Make sure you're in the correct project directory"
        return 1
    fi
    
    # Check if vite.config.ts exists
    if [ ! -f "vite.config.ts" ]; then
        print_warning "vite.config.ts not found"
        print_info "This might cause issues with Vite"
    fi
    
    # Check Node version
    if command -v node &> /dev/null; then
        local node_version=$(node --version)
        print_info "Node.js version: $node_version"
    else
        print_error "Node.js is not installed!"
        return 1
    fi
    
    # Check npm version
    if command -v npm &> /dev/null; then
        local npm_version=$(npm --version)
        print_info "npm version: $npm_version"
    else
        print_error "npm is not installed!"
        return 1
    fi
    
    print_success "Pre-flight checks completed"
    return 0
}

# ====================================================================
# Step 6: Start development server
# ====================================================================

start_dev_server() {
    print_step "Step 6: Starting development server..."
    
    print_info "Starting Vite dev server on port $PORT..."
    print_info "Press Ctrl+C to stop the server"
    echo ""
    
    echo -e "${GREEN}"
    cat << EOF
╔════════════════════════════════════════════════════════════════╗
║                   🎉 Server Starting...                        ║
║                                                                ║
║   Local:   http://localhost:$PORT                              ║
║   Network: Check terminal output below                        ║
║                                                                ║
║   Press Ctrl+C to stop the server                             ║
╚════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    
    # Wait a bit before opening browser
    sleep 2
    
    # Open browser (works on macOS, Linux with xdg-open, or WSL)
    if command -v open &> /dev/null; then
        # macOS
        open "$BROWSER_URL" 2>/dev/null &
        print_success "Browser opened at $BROWSER_URL"
    elif command -v xdg-open &> /dev/null; then
        # Linux
        xdg-open "$BROWSER_URL" 2>/dev/null &
        print_success "Browser opened at $BROWSER_URL"
    elif command -v wslview &> /dev/null; then
        # WSL
        wslview "$BROWSER_URL" 2>/dev/null &
        print_success "Browser opened at $BROWSER_URL"
    else
        print_info "Please open your browser manually at $BROWSER_URL"
    fi
    
    echo ""
    
    # Start the dev server (this will block until Ctrl+C)
    npm run dev
}

# ====================================================================
# Error Analysis Function
# ====================================================================

analyze_error() {
    local error_message=$1
    
    print_step "Analyzing error..."
    
    if [[ $error_message == *"EADDRINUSE"* ]]; then
        print_error "Error Type: Port is already in use"
        print_info "Solution: Run this script again to kill the process on the port"
    elif [[ $error_message == *"MODULE_NOT_FOUND"* ]]; then
        print_error "Error Type: Missing dependencies"
        print_info "Solution: Delete node_modules and run: npm install"
    elif [[ $error_message == *"EACCES"* ]] || [[ $error_message == *"permission denied"* ]]; then
        print_error "Error Type: Permission denied"
        print_info "Solution: Run with sudo or fix file permissions"
    elif [[ $error_message == *"ERR_PNPM_NO_MATCHING_VERSION"* ]]; then
        print_error "Error Type: Package version conflict"
        print_info "Solution: Check package.json for conflicting versions"
    else
        print_warning "Unknown error type"
        print_info "Check the error message above for details"
    fi
}

# ====================================================================
# Cleanup on exit
# ====================================================================

cleanup() {
    echo ""
    print_info "Shutting down gracefully..."
    exit 0
}

trap cleanup SIGINT SIGTERM

# ====================================================================
# Main Execution
# ====================================================================

main() {
    print_header
    
    # Step 1: Kill processes on port
    kill_process_on_port $PORT
    
    # Step 2: Navigate to project
    navigate_to_project
    
    # Step 3: Clean cache
    clean_cache
    
    # Step 4: Install dependencies
    install_dependencies
    
    # Step 5: Pre-flight checks
    if ! check_common_issues; then
        print_error "Pre-flight checks failed"
        read -p "Press Enter to exit..."
        exit 1
    fi
    
    # Step 6: Start server
    start_dev_server
}

# Run the script
main
