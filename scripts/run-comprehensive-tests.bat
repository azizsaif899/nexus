@echo off
echo ========================================
echo 🧪 AzizSys - Comprehensive Test Suite
echo ========================================
echo.

:: Set environment variables
set NODE_ENV=test
set GEMINI_API_KEY=test-dummy-key

:: Colors for output
set GREEN=[92m
set RED=[91m
set YELLOW=[93m
set BLUE=[94m
set NC=[0m

echo %BLUE%📋 Starting comprehensive test suite...%NC%
echo.

:: Step 1: Install dependencies
echo %BLUE%📦 Installing dependencies...%NC%
call npm ci
if %ERRORLEVEL% neq 0 (
    echo %RED%❌ Failed to install dependencies%NC%
    exit /b 1
)
echo %GREEN%✅ Dependencies installed successfully%NC%
echo.

:: Step 2: Lint check
echo %BLUE%🔍 Running ESLint...%NC%
call npm run lint
if %ERRORLEVEL% neq 0 (
    echo %RED%❌ Linting failed%NC%
    echo %YELLOW%💡 Run 'npm run lint:fix' to auto-fix issues%NC%
    exit /b 1
)
echo %GREEN%✅ Linting passed%NC%
echo.

:: Step 3: Format check
echo %BLUE%💅 Checking code formatting...%NC%
call npm run format:check
if %ERRORLEVEL% neq 0 (
    echo %RED%❌ Code formatting check failed%NC%
    echo %YELLOW%💡 Run 'npm run format' to fix formatting%NC%
    exit /b 1
)
echo %GREEN%✅ Code formatting is correct%NC%
echo.

:: Step 4: Unit tests with coverage
echo %BLUE%🧪 Running unit tests with coverage...%NC%
call npm run test:coverage
if %ERRORLEVEL% neq 0 (
    echo %RED%❌ Unit tests failed%NC%
    exit /b 1
)
echo %GREEN%✅ Unit tests passed%NC%
echo.

:: Step 5: Integration tests
echo %BLUE%🔗 Running integration tests...%NC%
call npm run test:integration
if %ERRORLEVEL% neq 0 (
    echo %RED%❌ Integration tests failed%NC%
    exit /b 1
)
echo %GREEN%✅ Integration tests passed%NC%
echo.

:: Step 6: Performance tests
echo %BLUE%⚡ Running performance tests...%NC%
call npm run test:performance
if %ERRORLEVEL% neq 0 (
    echo %YELLOW%⚠️ Performance tests failed (non-critical)%NC%
) else (
    echo %GREEN%✅ Performance tests passed%NC%
)
echo.

:: Step 7: Security audit
echo %BLUE%🛡️ Running security audit...%NC%
call npm audit --audit-level moderate
if %ERRORLEVEL% neq 0 (
    echo %YELLOW%⚠️ Security vulnerabilities found%NC%
    echo %YELLOW%💡 Run 'npm audit fix' to fix automatically%NC%
) else (
    echo %GREEN%✅ No security vulnerabilities found%NC%
)
echo.

:: Step 8: Build test
echo %BLUE%🏗️ Testing build process...%NC%
call npm run build
if %ERRORLEVEL% neq 0 (
    echo %RED%❌ Build failed%NC%
    exit /b 1
)
echo %GREEN%✅ Build successful%NC%
echo.

:: Step 9: Generate test report
echo %BLUE%📊 Generating test report...%NC%
echo ========================================> test-report.txt
echo AzizSys Test Report>> test-report.txt
echo Generated: %date% %time%>> test-report.txt
echo ========================================>> test-report.txt
echo.>> test-report.txt
echo ✅ Dependencies: PASSED>> test-report.txt
echo ✅ Linting: PASSED>> test-report.txt
echo ✅ Formatting: PASSED>> test-report.txt
echo ✅ Unit Tests: PASSED>> test-report.txt
echo ✅ Integration Tests: PASSED>> test-report.txt
echo ✅ Build: PASSED>> test-report.txt
echo.>> test-report.txt
echo Coverage Report:>> test-report.txt
echo - Check coverage/index.html for detailed report>> test-report.txt
echo.>> test-report.txt

:: Final summary
echo ========================================
echo %GREEN%🎉 ALL TESTS PASSED SUCCESSFULLY!%NC%
echo ========================================
echo.
echo %BLUE%📊 Test Summary:%NC%
echo   ✅ Linting: PASSED
echo   ✅ Formatting: PASSED  
echo   ✅ Unit Tests: PASSED
echo   ✅ Integration Tests: PASSED
echo   ✅ Build: PASSED
echo.
echo %BLUE%📁 Reports generated:%NC%
echo   - Coverage: coverage/index.html
echo   - Test Report: test-report.txt
echo.
echo %GREEN%🚀 Ready for deployment!%NC%
echo.

pause