@echo off
echo Setting up Android SDK environment...

set ANDROID_HOME=C:\Users\user\AppData\Local\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools

echo Android SDK configured!
echo.
echo Available commands:
echo - npm run cap:run:android
echo - npm run cap:open:android
echo - npm run build:mobile
echo.
echo To run the app:
echo 1. Make sure you have an Android emulator or device connected
echo 2. Run: npm run cap:run:android
echo.
echo Checking ADB...
adb version

pause
