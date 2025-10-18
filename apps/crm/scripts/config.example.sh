#!/bin/bash

# ====================================================================
# CRM Nxs - Scripts Configuration (Bash)
# ====================================================================
# انسخ هذا الملف إلى config.sh وحدّث المسارات
# cp config.example.sh config.sh
# ====================================================================

# ⚠️ مهم: حدّث هذا المسار ليطابق مسار مشروعك الفعلي
export WORKSPACE_ROOT="/path/to/nexus"

# ⚠️ اسم التطبيق في Workspace
export APP_NAME="CRM"

# المنافذ
export DEV_PORT=5173
export PREVIEW_PORT=4173

echo "✅ Configuration loaded successfully!"
echo "   Workspace: $WORKSPACE_ROOT"
echo "   App: $APP_NAME"
echo "   Dev Port: $DEV_PORT"
