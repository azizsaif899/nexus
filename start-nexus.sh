#!/bin/bash
# Nexus AI Main - Startup Script
# This script ensures the application runs smoothly without port conflicts

echo "🚀 Starting Nexus AI Main..."
echo "==============================="

# Navigate to the correct directory
cd "$(dirname "$0")/apps/nexus-ai-main" || exit 1

# Kill any existing processes on port 3000
echo "🧹 Cleaning up port 3000..."
npx kill-port 3000 2>/dev/null || true

# Clear any cached files
echo "🗂️ Clearing cache..."
rm -rf node_modules/.vite 2>/dev/null || true
rm -rf dist 2>/dev/null || true

# Start the development server
echo "▶️ Starting development server on http://localhost:3000"
echo "==============================="
npx vite --port 3000 --host