@echo off
echo ========================================
echo HUMSJ Charity - Complete Repository Separation
echo ========================================
echo.

REM Backup current state
echo Creating backup of current repository...
mkdir backup-%date:~-4,4%%date:~-10,2%%date:~-7,2%
xcopy /E /I . backup-%date:~-4,4%%date:~-10,2%%date:~-7,2%\*.*

echo.
echo SEPARATION OPTIONS:
echo 1. Setup Website Repository Only
echo 2. Setup Mobile Repository Only
echo 3. Setup Both Repositories
echo 4. Create Sync Scripts Only
echo 5. Exit
echo.
set /p choice="Enter choice (1-5): "

if "%choice%"=="1" (
    echo.
    echo Setting up Website Repository...
    call setup-website-repo.bat
) else if "%choice%"=="2" (
    echo.
    echo Setting up Mobile Repository...
    call setup-mobile-repo.bat
) else if "%choice%"=="3" (
    echo.
    echo Setting up Website Repository...
    call setup-website-repo.bat
    echo.
    echo Setting up Mobile Repository...
    call setup-mobile-repo.bat
) else if "%choice%"=="4" (
    echo Sync scripts already created.
) else (
    echo Exiting...
    exit /b
)

echo.
echo ========================================
echo SEPARATION COMPLETE!
echo ========================================
echo.
echo Next Steps:
echo 1. Create GitHub repositories:
echo    - humsj-charity-website
echo    - humsj-charity-mobile
echo.
echo 2. Add remotes to each repository
echo 3. Push initial commits
echo 4. Configure GitHub Actions secrets
echo 5. Test deployments
echo.
echo Documentation available in:
echo - REPO-SEPARATION.md
echo - DEPLOYMENT.md
echo.
pause
