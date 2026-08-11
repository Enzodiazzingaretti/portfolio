@echo off
title kexxy-portfolio - dev
cd /d "%~dp0"

REM Locks huerfanos de git: bloquean el proximo add/commit si quedan
if exist ".git\index.lock" del /q ".git\index.lock"
if exist ".git\HEAD.lock" del /q ".git\HEAD.lock"
if exist ".git\objects\maintenance.lock" del /q ".git\objects\maintenance.lock"

REM react-router se agrego en esta rama; instala si falta
if not exist "node_modules\react-router-dom\package.json" (
  echo Instalando dependencias...
  call npm install
)

REM Abre el navegador unos segundos despues, cuando Vite ya escucha
start "" /min cmd /c "timeout /t 8 /nobreak >nul && start "" msedge http://localhost:5173/"

echo.
echo   Levantando Vite en http://localhost:5173/
echo   Ctrl+C para cortar.
echo.
call npm run dev
pause
