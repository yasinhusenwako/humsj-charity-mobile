@echo off
echo Setting up HUMSJ Charity Mobile Repository...

REM Create mobile-specific gitignore
echo # Mobile specific > .gitignore
echo android/ >> .gitignore
echo ios/ >> .gitignore
echo *.apk >> .gitignore
echo *.aab >> .gitignore
echo node_modules >> .gitignore
echo dist/ >> .gitignore
echo *.log >> .gitignore
echo. >> .gitignore
echo # Website files (exclude from mobile) >> .gitignore
echo .vercel >> .gitignore
echo .netlify >> .gitignore
echo deploy-website.bat >> .gitignore
echo .github/workflows/website.yml >> .gitignore

REM Initialize mobile repo
echo Initializing mobile repository...
git init
git add .
git commit -m "Initial mobile commit - HUMSJ Charity Android App"

echo.
echo Mobile repository setup complete!
echo.
echo Next steps:
echo 1. Create GitHub repository: humsj-charity-mobile
echo 2. Add remote: git remote add origin https://github.com/yourusername/humsj-charity-mobile.git
echo 3. Push: git push -u origin main
echo.
pause
