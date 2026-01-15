@echo off
echo.
echo ========================================
echo   DawaiLo Setup Verification
echo ========================================
echo.

echo [1/5] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
) else (
    node --version
    echo ✅ Node.js installed
)
echo.

echo [2/5] Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm not found!
    pause
    exit /b 1
) else (
    npm --version
    echo ✅ npm installed
)
echo.

echo [3/5] Checking node_modules...
if exist "node_modules\" (
    echo ✅ Dependencies installed
) else (
    echo ⚠️  Dependencies not installed
    echo    Run: npm install
)
echo.

echo [4/5] Checking project structure...
if exist "src\App.jsx" (
    echo ✅ Frontend files present
) else (
    echo ❌ Frontend files missing!
)

if exist "server\index.js" (
    echo ✅ Backend files present
) else (
    echo ❌ Backend files missing!
)
echo.

echo [5/5] Checking documentation...
if exist "QUICK_START.md" (
    echo ✅ Documentation present
) else (
    echo ⚠️  Documentation missing
)
echo.

echo ========================================
echo   Setup Status
echo ========================================
echo.

if exist "node_modules\" (
    if exist "src\App.jsx" (
        if exist "server\index.js" (
            echo ✅ ALL CHECKS PASSED!
            echo.
            echo You're ready to start DawaiLo:
            echo   1. Double-click start.bat
            echo   2. Or run: npm run dev:all
            echo.
            echo See QUICK_START.md for detailed instructions.
        )
    )
) else (
    echo ⚠️  SETUP INCOMPLETE
    echo.
    echo Next steps:
    echo   1. Run: npm install
    echo   2. Then run this script again
)

echo.
echo ========================================
pause
