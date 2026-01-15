@echo off
echo Starting DawaiLo...
echo.
echo Backend API will run on http://localhost:3001
echo Frontend will run on http://localhost:5173
echo.
start cmd /k "npm run server"
timeout /t 2 /nobreak >nul
start cmd /k "npm run dev"
echo.
echo Both servers are starting in separate windows...
echo Close this window when done.
