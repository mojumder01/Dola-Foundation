@echo off
title Maze Bloom - Run
cd /d "%~dp0"

echo ============================
echo   Maze Bloom - Starting...
echo ============================
echo.

flutter pub get
if errorlevel 1 (
    echo.
    echo [ERROR] flutter pub get failed. Check the messages above.
    pause
    exit /b 1
)

echo.
echo Looking for a connected device...
flutter devices

echo.
echo Launching app...
flutter run

pause
