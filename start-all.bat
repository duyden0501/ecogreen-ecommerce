@echo off
setlocal enabledelayedexpansion
title EcoGreen E-Commerce - Fullstack Startup

echo =====================================================================
echo    ECOGREEN E-COMMERCE - FULLSTACK STARTUP (1-CLICK)
echo =====================================================================
echo.

set "ROOT_DIR=%~dp0"

:: 1. Khoi dong Docker Database
echo [1/3] Kiem tra co so du lieu PostgreSQL (Docker)...
cd /d "%ROOT_DIR%docker"
docker compose up -d
if %ERRORLEVEL% NEQ 0 (
    echo [CANH BAO] Khong the chay docker compose. Hay dam bao Docker Desktop dang chay!
) else (
    echo [OK] PostgreSQL da san sang tren cong 5433.
)
echo.

:: 2. Khoi dong Backend Spring Boot
echo [2/3] Bat Backend Spring Boot (Cong 8081)...
start "EcoGreen Backend (Spring Boot - Port 8081)" cmd /k "cd /d ""%ROOT_DIR%backend"" && set ""JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot""& .\mvnw.cmd spring-boot:run"
echo [OK] Da mo cua so Backend.
echo.

:: 3. Khoi dong Frontend React
echo [3/3] Bat Frontend React Vite (Cong 5173)...
start "EcoGreen Frontend (React - Port 5173)" cmd /k "cd /d ""%ROOT_DIR%frontend"" && npm run dev"
echo [OK] Da mo cua so Frontend.
echo.

echo =====================================================================
echo    HE THONG DANG KHOI DONG THANH CONG!
echo =====================================================================
echo    * Giao dien Web (Frontend):  http://localhost:5173
echo    * API Backend (Spring Boot): http://localhost:8081/api/products
echo.
echo    TAI KHOAN DUNG THU:
echo    * Quan tri vien (Admin): admin / admin123
echo    * Khach hang (User):     khachhang / 123456
echo =====================================================================
echo.

:: Mo trinh duyet tu dong sau 3 giay
timeout /t 3 >nul
start http://localhost:5173
exit
