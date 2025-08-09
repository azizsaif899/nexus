@echo off
echo 🔍 Python Environment Check
echo ========================
echo.

echo 📍 Current Python installations:
where python
echo.

echo 📊 Python version:
python --version
echo.

echo 📊 Python 3 version (if available):
python3 --version 2>nul || echo Python3 not found
echo.

echo 📦 Pip version:
pip --version
echo.

echo 🌍 Python path:
python -c "import sys; print(sys.executable)"
echo.

echo 📚 Installed packages (key ones):
pip list | findstr -i "langgraph langchain fastapi"
echo.

echo 💡 Recommendations:
if python --version 2>&1 | findstr "3.1[1-9]" >nul (
    echo ✅ Python version is compatible
) else (
    echo ❌ Python version is too old - need 3.11+
    echo 🔧 Run: upgrade_python.bat
)

pause