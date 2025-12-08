@echo off
echo Setting up HUMSJ Charity Website Repository...

REM Create website-specific gitignore
echo # Website specific > .gitignore
echo dist/ >> .gitignore
echo .vercel >> .gitignore
echo .netlify >> .gitignore
echo node_modules >> .gitignore
echo *.log >> .gitignore
echo. >> .gitignore
echo # Mobile files (exclude from website) >> .gitignore
echo android/ >> .gitignore
echo ios/ >> .gitignore
echo capacitor.config.ts >> .gitignore
echo setup-android.bat >> .gitignore
echo build-android.bat >> .gitignore
echo src/components/BottomNav.tsx >> .gitignore
echo src/components/Layout.tsx >> .gitignore
echo src/services/mobileService.ts >> .gitignore
echo .github/workflows/android.yml >> .gitignore

REM Initialize website repo
echo Initializing website repository...
git init
git add .
git commit -m "Initial website commit - HUMSJ Charity"

echo.
echo Website repository setup complete!
echo.
echo Next steps:
echo 1. Create GitHub repository: humsj-charity-website
echo 2. Add remote: git remote add origin https://github.com/yourusername/humsj-charity-website.git
echo 3. Push: git push -u origin main
echo.
pause
