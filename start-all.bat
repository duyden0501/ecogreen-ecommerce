@echo off
chcp 65001 >nul
title Khởi Động Dự Án EcoGreen E-Commerce

echo =====================================================================
echo    🌿 ECOGREEN E-COMMERCE - FULLSTACK STARTUP (1-CLICK)
echo =====================================================================
echo.

:: 1. Khởi động Docker Database
echo [1/3] Kiểm tra và khởi động cơ sở dữ liệu PostgreSQL (Docker)...
cd docker
docker compose up -d
cd ..
if %ERRORLEVEL% NEQ 0 (
    echo [CẢNH BÁO] Không thể chạy docker compose. Đảm bảo Docker Desktop đang bật!
) else (
    echo [OK] PostgreSQL đã sẵn sàng trên cổng 5433.
)
echo.

:: 2. Khởi động Backend Spring Boot
echo [2/3] Bật Backend Spring Boot (Cổng 8081)...
start "EcoGreen Backend (Spring Boot - Port 8081)" cmd /k "cd backend && set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot && .\mvnw.cmd spring-boot:run"
echo [OK] Đã mở cửa sổ Backend.
echo.

:: 3. Khởi động Frontend React
echo [3/3] Bật Frontend React Vite (Cổng 5173)...
start "EcoGreen Frontend (React - Port 5173)" cmd /k "cd frontend && npm run dev"
echo [OK] Đã mở cửa sổ Frontend.
echo.

echo =====================================================================
echo    🎉 TOÀN BỘ HỆ THỐNG ĐÃ ĐƯỢC BẬT THÀNH CÔNG!
echo =====================================================================
echo    • Giao diện Web (Frontend): http://localhost:5173
echo    • API Backend (Spring Boot): http://localhost:8081/api/products
echo.
echo    🔑 TÀI KHOẢN DÙNG THỬ:
echo    • Quản trị viên (Admin): admin / admin123
echo    • Khách hàng (User):     khachhang / 123456
echo =====================================================================
echo.

:: Đợi 5 giây rồi mở trình duyệt tự động
timeout /t 5 >nul
start http://localhost:5173
exit
