# 🌿 EcoGreen E-Commerce

> Nền tảng thương mại điện tử chuyên về sản phẩm tái chế & thân thiện môi trường, tích hợp tính năng theo dõi CO₂ giảm phát thải và hệ thống Điểm Xanh.

---

## 🏗️ Công nghệ sử dụng

| Tầng | Công nghệ |
|------|-----------|
| Frontend | Next.js 14 (App Router), Tailwind CSS, Zustand, React Query |
| Backend | Node.js, Express.js, Prisma ORM |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Auth | JWT + Bcrypt |
| Thanh toán | VNPay Sandbox |
| Upload | Cloudinary |
| Email | NodeMailer |

---

## 📁 Cấu trúc dự án

```
ecogreen-ecommerce/
├── backend/        # Node.js + Express API (Port 5000)
└── frontend/       # Next.js 14 App (Port 3000)
```

---

## ⚙️ Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống
- Node.js >= 18.x
- Docker & Docker Compose
- npm >= 9.x

### 2. Clone repository
```bash
git clone https://github.com/your-org/ecogreen-ecommerce.git
cd ecogreen-ecommerce
```

### 3. Cấu hình biến môi trường
```bash
# Sao chép file mẫu
cp .env.example backend/.env
cp .env.example frontend/.env.local

# Chỉnh sửa giá trị thực tế
nano backend/.env
nano frontend/.env.local
```

### 4. Khởi chạy PostgreSQL & Redis
```bash
npm run docker:up
```

### 5. Cài đặt dependencies
```bash
npm run install:all
```

### 6. Khởi tạo CSDL & nạp dữ liệu mẫu
```bash
npm run db:push
npm run db:seed
```

### 7. Chạy toàn bộ dự án
```bash
npm run dev
# Backend: http://localhost:5000
# Frontend: http://localhost:3000
```

---

## 👥 Phân công thành viên

| TV | Trách nhiệm chính |
|----|-------------------|
| TV 1 | Auth, JWT, OTP Email, Quản lý User |
| TV 2 | Sản phẩm, Đánh giá, Upload ảnh, Chất liệu |
| TV 3 | Giỏ hàng (Redis), Đặt hàng, Lịch sử đơn |
| TV 4 | Tích hợp VNPay Sandbox, Webhook IPN |
| TV 5 | Admin CMS, Dashboard, Quản lý kho |
| TV 6 | Điểm Xanh, CO₂ Calculator, Eco Wallet |
| TV 7 | DevOps, Cấu trúc dự án, Security Middleware |

---

## 🌱 Tính năng nổi bật

- ♻️ **Sản phẩm Xanh**: Lọc theo chất liệu tái chế (vải tre, bã cà phê, chai PET...)
- 🌍 **CO₂ Tracker**: Tính toán lượng CO₂ giảm phát thải khi mua hàng
- 💚 **Eco Wallet**: Tích điểm & đổi voucher cho khách hàng thân thiết
- 💳 **VNPay**: Thanh toán an toàn qua cổng VNPay Sandbox
- 🔐 **Bảo mật**: JWT + OTP Email, chống DDoS với Helmet & Rate Limiting

---

## 📄 License

MIT © 2024 EcoGreen Team
