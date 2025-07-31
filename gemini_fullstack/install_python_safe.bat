@echo off
echo 🐍 Python 3.11 Safe Installation Guide
echo =====================================
echo.

echo 📋 Step 1: Download Python 3.11.9 (LTS)
echo Direct link: https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe
echo.

echo 📋 Step 2: Installation Settings (IMPORTANT!)
echo ✅ Check: "Add Python 3.11 to PATH"
echo ✅ Check: "Install for all users" 
echo ✅ Choose: "Customize installation"
echo ✅ Check: "pip", "tcl/tk", "Python test suite"
echo ✅ Check: "Add Python to environment variables"
echo ✅ Check: "Precompile standard library"
echo.

echo 📋 Step 3: Verify Installation
echo After installation, open NEW command prompt and run:
echo   python --version
echo   pip --version
echo.

echo 🚀 Opening download page...
start https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe

echo.
echo ⏳ After installation, press any key to test...
pause

echo 🧪 Testing Python installation...
python --version
if errorlevel 1 (
    echo ❌ Python not found. Please restart command prompt.
    pause
    exit /b 1
)

echo ✅ Python installed successfully!
echo 📦 Installing project dependencies...
cd backend
pip install .
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ All done! Ready to run the project.
pause