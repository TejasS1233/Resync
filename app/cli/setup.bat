@echo off
echo 🚀 Setting up Resync CLI...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18+ first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js found: %NODE_VERSION%

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed. Please install npm first.
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✓ npm found: %NPM_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo ✓ Dependencies installed
echo.

REM Link CLI globally
echo 🔗 Linking CLI globally...
call npm link

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to link CLI
    exit /b 1
)

echo ✓ CLI linked successfully
echo.

echo ✨ Setup complete!
echo.
echo You can now use the 'resync' command from anywhere.
echo.
echo Quick start:
echo   resync auth login
echo   resync goals list
echo   resync --help
echo.

pause
