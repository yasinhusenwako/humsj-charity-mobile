@echo off
echo Syncing changes between Website and Mobile repositories...

REM Get current branch and changes
echo Checking for changes...
git status

echo.
echo SYNC OPTIONS:
echo 1. Push changes to Website repo
echo 2. Push changes to Mobile repo
echo 3. Push to both repos
echo 4. Cancel
echo.
set /p choice="Enter choice (1-4): "

if "%choice%"=="1" (
    echo Pushing to Website repository...
    git remote set-url origin https://github.com/yourusername/humsj-charity-website.git
    git push origin main
    echo Changes pushed to website repo!
) else if "%choice%"=="2" (
    echo Pushing to Mobile repository...
    git remote set-url origin https://github.com/yourusername/humsj-charity-mobile.git
    git push origin main
    echo Changes pushed to mobile repo!
) else if "%choice%"=="3" (
    echo Pushing to both repositories...
    
    REM Push to website
    echo Pushing to Website...
    git remote set-url origin https://github.com/yourusername/humsj-charity-website.git
    git push origin main
    
    REM Push to mobile
    echo Pushing to Mobile...
    git remote set-url origin https://github.com/yourusername/humsj-charity-mobile.git
    git push origin main
    
    echo Changes pushed to both repos!
) else (
    echo Sync cancelled.
)

echo.
pause
