@echo off
echo 🧪 Testing Gemini Fullstack Application...
echo.

REM Test backend CLI
echo 📋 Testing backend CLI...
cd backend
python examples/cli_research.py "What is artificial intelligence?" > test_output.txt 2>&1
if errorlevel 1 (
    echo ❌ Backend CLI test failed
    type test_output.txt
    del test_output.txt
    pause
    exit /b 1
) else (
    echo ✅ Backend CLI test passed
    echo 📄 Output:
    type test_output.txt
    del test_output.txt
)
cd ..

echo.
echo 🌐 Manual frontend test:
echo 1. Open http://localhost:3001/app
echo 2. Try asking: "What are the latest trends in AI?"
echo 3. Verify the response includes citations
echo.

pause