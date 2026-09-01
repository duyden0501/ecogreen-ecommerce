```markdown
## 👥 Phân Công Nhiệm Vụ 7 Thành Viên (Mô Hình Domain)
* 🔐 **Thành viên 1 — Xác thực & Tài khoản:**
  * **BE:** Đăng ký, Đăng nhập (JWT, Bcrypt), Phân quyền RBAC, Mail OTP.
  * **FE:** Giao diện Login, Register, Profile cá nhân.
* 📦 **Thành viên 2 — Sản phẩm & Nội dung:**
  * **BE:** API Sản phẩm, Danh mục, Đánh giá, Upload Cloudinary, Seed data.
  * **FE:** Trang Shop, Bộ lọc chất liệu xanh, Chi tiết sản phẩm.
* 🛒 **Thành viên 3 — Giỏ hàng & Đặt hàng:**
  * **BE:** API Giỏ hàng (Redis), Transaction tạo đơn, trừ tồn kho.
  * **FE:** Mini CartDrawer, Trang Giỏ hàng, Form Checkout, Lịch sử đơn.
* 💳 **Thành viên 4 — Thanh toán trực tuyến:**
  * **BE:** Tích hợp VNPay Sandbox, Băm mã SHA-512, Webhook IPN đối soát.
  * **FE:** Giao diện kết quả giao dịch (Thành công / Thất bại).
* 📊 **Thành viên 5 — Quản trị Admin CMS:**
  * **BE:** API thống kê chỉ số Dashboard.
  * **FE:** Toàn bộ Admin: Biểu đồ Recharts, Quản lý kho, Duyệt đơn, Quản lý User.
* 🌱 **Thành viên 6 — Trải nghiệm Sống Xanh:**
  * **BE:** Thuật toán tính $CO_2$ giảm thải, Logic Điểm Xanh (Eco-Points).
  * **FE:** Trang chủ, Widget đếm số $CO_2$ cả cộng đồng, Ví Điểm Xanh.
* 🏗️ **Thành viên 7 (Lead) — Hạ tầng & Giao diện chung:**
  * **BE & DevOps:** Khởi tạo CSDL Prisma, Docker, Redis, Bảo mật Helmet/CORS.
  * **FE Core:** Layout, Header/Footer, Bảng màu Tailwind, Axios, UI Component dùng chung.

ecogreen-ecommerce/
├── 📄 docker-compose.yml                        # [TV 7] Khởi chạy PostgreSQL, Redis cục bộ
├── 📄 .gitignore                                # [TV 7] Bỏ qua node_modules, .env khi đẩy Git
├── 📄 .env.example                              # [TV 7] Mẫu biến môi trường cho cả nhóm
├── 📄 README.md                                 # [TV 7] Báo cáo dự án & hướng dẫn cài đặt
├── 📄 package.json                              # [TV 7] Script chạy đồng thời 2 server
│
├── 📁 backend/                                  # ==================== PHÂN HỆ BACKEND (NODE.JS) ====================
│   ├── 📁 prisma/                               # QUẢN LÝ CSDL & SEED DATA
│   │   ├── 📄 schema.prisma                     # [TV 7] Khởi tạo cấu trúc bảng chung (Các TV bổ sung theo domain)
│   │   └── 📄 seed.js                           # [TV 2] Script nạp dữ liệu sản phẩm tái chế mẫu
│   │
│   ├── 📁 src/
│   │   ├── 📁 config/                           # CẤU HÌNH HỆ THỐNG
│   │   │   ├── 📄 db.js                         # [TV 7] Khởi tạo kết nối Prisma Client
│   │   │   ├── 📄 redis.js                      # [TV 3] Cấu hình Redis Cache cho Giỏ hàng
│   │   │   ├── 📄 cloudinary.js                 # [TV 2] Cấu hình SDK upload ảnh sản phẩm
│   │   │   └── 📄 vnpay.config.js               # [TV 4] Cấu hình khóa bảo mật VNPay Sandbox
│   │   │
│   │   ├── 📁 middlewares/                      # BẢO MẬT & XÁC THỰC DÙNG CHUNG
│   │   │   ├── 📄 auth.middleware.js            # [TV 1] Kiểm tra JWT Token đăng nhập
│   │   │   ├── 📄 role.middleware.js            # [TV 1] Phân quyền Admin / Customer
│   │   │   ├── 📄 security.middleware.js        # [TV 7] Chống DDoS, Helmet, CORS
│   │   │   └── 📄 error.middleware.js           # [TV 7] Bộ xử lý bắt lỗi tập trung
│   │   │
│   │   ├── 📁 controllers/                      # TIẾP NHẬN & PHẢN HỒI HTTP REQUEST
│   │   │   ├── 📄 auth.controller.js            # [TV 1] Xử lý Đăng ký, Đăng nhập, OTP
│   │   │   ├── 📄 user.controller.js            # [TV 1] Quản lý thông tin tài khoản người dùng
│   │   │   ├── 📄 product.controller.js         # [TV 2] Tìm kiếm, lọc sản phẩm xanh
│   │   │   ├── 📄 review.controller.js          # [TV 2] Đánh giá & bình luận sản phẩm
│   │   │   ├── 📄 cart.controller.js            # [TV 3] Thêm, sửa, xóa giỏ hàng
│   │   │   ├── 📄 order.controller.js           # [TV 3] Tạo đơn, hủy đơn hàng
│   │   │   ├── 📄 vnpay.controller.js           # [TV 4] Xử lý Webhook IPN ngân hàng
│   │   │   └── 📄 dashboard.controller.js       # [TV 5] API thống kê doanh thu, đơn hàng, CO2
│   │   │
│   │   ├── 📁 services/                         # LOGIC NGHIỆP VỤ & TRUY VẤN CSDL
│   │   │   ├── 📄 auth.service.js               # [TV 1] Mã hóa Bcrypt, ký JWT Token
│   │   │   ├── 📄 mail.service.js               # [TV 1] Gửi mail OTP qua NodeMailer
│   │   │   ├── 📄 product.service.js            # [TV 2] Truy vấn CSDL sản phẩm & kho hàng
│   │   │   ├── 📄 upload.service.js             # [TV 2] Xử lý upload ảnh lên Cloudinary
│   │   │   ├── 📄 cart.service.js               # [TV 3] Lưu giỏ hàng vào DB & Redis
│   │   │   ├── 📄 order.service.js              # [TV 3] Transaction tạo đơn & trừ tồn kho
│   │   │   ├── 📄 vnpay.service.js              # [TV 4] Sinh URL băm mật mã SHA-512
│   │   │   └── 📄 eco-points.service.js         # [TV 6] Thuật toán tích/đổi Điểm Xanh
│   │   │
│   │   ├── 📁 utils/                            # HÀM THUẬT TOÁN BỔ TRỢ
│   │   │   ├── 📄 jwt.util.js                   # [TV 1] Hàm sinh & giải mã JWT Token
│   │   │   ├── 📄 eco_calc.util.js              # [TV 6] Thuật toán tính CO2 giảm phát thải
│   │   │   └── 📄 vnpay.util.js                 # [TV 4] Hàm băm mã bảo mật SHA-512 VNPay
│   │   │
│   │   ├── 📄 app.js                            # [TV 7] Khởi tạo ứng dụng Express
│   │   └── 📄 server.js                         # [TV 7] File chính chạy Backend Port 5000
│   │
│   ├── 📄 package.json                          # [TV 7] Khai báo thư viện Backend ("type": "module")
│   └── 📄 .env                                  # [TV 7] Cấu hình CSDL & khóa bí mật
│
├── 📁 frontend/                                 # ==================== PHÂN HỆ FRONTEND (NEXT.JS) ====================
│   ├── 📁 public/                               # [TV 7] Lưu trữ logo, banner sống xanh, icon
│   │
│   ├── 📁 src/
│   │   ├── 📁 app/                              # NEXT.JS 14+ APP ROUTER
│   │   │   ├── 📁 (client)/                     # GIAO DIỆN KHÁCH HÀNG
│   │   │   │   ├── 📄 layout.jsx                # [TV 7] Header, Footer, Thanh điều hướng dùng chung
│   │   │   │   ├── 📄 page.jsx                  # [TV 6] Trang chủ & Widget đếm số CO2 giảm thải
│   │   │   │   ├── 📁 products/                 # SẢN PHẨM
│   │   │   │   │   ├── 📄 page.jsx              # [TV 2] Danh sách sản phẩm & Bộ lọc đa năng
│   │   │   │   │   └── 📁 [slug]/               # [TV 2]
│   │   │   │   │       └── 📄 page.jsx          # [TV 2] Chi tiết sản phẩm, Gallery & Đánh giá
│   │   │   │   ├── 📁 materials/                # CÂU CHUYỆN CHẤT LIỆU
│   │   │   │   │   └── 📄 page.jsx              # [TV 2] Trang giới thiệu vải tre, bã cà phê...
│   │   │   │   ├── 📁 cart/                     # GIỎ HÀNG
│   │   │   │   │   └── 📄 page.jsx              # [TV 3] Trang Giỏ hàng & Ước tính CO2 đơn hàng
│   │   │   │   ├── 📁 checkout/                 # THANH TOÁN
│   │   │   │   │   └── 📄 page.jsx              # [TV 3] Form đặt hàng & Chọn COD/VNPay
│   │   │   │   ├── 📁 payment-result/           # KẾT QUẢ GIAO DỊCH
│   │   │   │   │   └── 📄 page.jsx              # [TV 4] Màn hình kết quả VNPay trả về
│   │   │   │   └── 📁 profile/                  # TÀI KHOẢN KHÁCH HÀNG
│   │   │   │       ├── 📄 page.jsx              # [TV 1] Thông tin cá nhân người dùng
│   │   │   │       ├── 📁 orders/               # [TV 3]
│   │   │   │       │   └── 📄 page.jsx          # [TV 3] Lịch sử đơn hàng đã mua
│   │   │   │       └── 📁 eco-wallet/           # [TV 6]
│   │   │   │           └── 📄 page.jsx          # [TV 6] Ví Điểm Xanh & Đổi Voucher
│   │   │   │
│   │   │   ├── 📁 (admin)/                      # [TV 5] GIAO DIỆN QUẢN TRỊ ADMIN CMS
│   │   │   │   ├── 📄 layout.jsx                # [TV 5] Khung Sidebar & Guard chặn user
│   │   │   │   ├── 📁 dashboard/                # [TV 5]
│   │   │   │   │   └── 📄 page.jsx              # [TV 5] Bảng điều khiển doanh số & rác tái chế
│   │   │   │   ├── 📁 products/                 # [TV 5]
│   │   │   │   │   ├── 📄 page.jsx              # [TV 5] Bảng danh sách kho hàng
│   │   │   │   │   └── 📁 new/                  # [TV 5]
│   │   │   │   │       └── 📄 page.jsx          # [TV 5] Form thêm mới sản phẩm + upload ảnh
│   │   │   │   ├── 📁 categories/               # [TV 5]
│   │   │   │   │   └── 📄 page.jsx              # [TV 5] Quản lý danh mục sản phẩm
│   │   │   │   ├── 📁 orders/                   # [TV 5]
│   │   │   │   │   ├── 📄 page.jsx              # [TV 5] Bảng duyệt đơn & đổi trạng thái
│   │   │   │   │   └── 📁 [id]/                 # [TV 5]
│   │   │   │   │       └── 📄 page.jsx          # [TV 5] Chi tiết đơn & in phiếu giao hàng
│   │   │   │   ├── 📁 users/                    # [TV 5]
│   │   │   │   │   └── 📄 page.jsx              # [TV 5] Quản lý danh sách tài khoản & phân quyền
│   │   │   │   └── 📁 vouchers/                 # [TV 5]
│   │   │   │       └── 📄 page.jsx              # [TV 5] Tạo và quản lý mã giảm giá Eco
│   │   │   │
│   │   │   ├── 📁 (auth)/                       # ĐĂNG NHẬP / ĐĂNG KÝ
│   │   │   │   ├── 📁 login/                    # [TV 1]
│   │   │   │   │   └── 📄 page.jsx              # [TV 1] Giao diện Đăng nhập
│   │   │   │   └── 📁 register/                 # [TV 1]
│   │   │   │       └── 📄 page.jsx              # [TV 1] Giao diện Đăng ký tài khoản
│   │   │   │
│   │   │   ├── 📄 layout.jsx                    # [TV 7] Root layout gắn React Query Provider
│   │   │   └── 📄 globals.css                   # [TV 7] Tailwind CSS & Bảng màu Eco
│   │   │
│   │   ├── 📁 components/                       # CÁC COMPONENT GIAO DIỆN TÁI SỬ DỤNG
│   │   │   ├── 📁 ui/                           # [TV 7] Button, Input, Modal, Badge dùng chung
│   │   │   ├── 📁 client/                       # COMPONENT PHÍA KHÁCH HÀNG
│   │   │   │   ├── 📄 Header.jsx                # [TV 7] Thanh menu điều hướng
│   │   │   │   ├── 📄 Footer.jsx                # [TV 7] Chân trang cam kết xanh
│   │   │   │   ├── 📄 ProductCard.jsx           # [TV 2] Thẻ sản phẩm có nhãn % tái chế
│   │   │   │   ├── 📄 FilterSidebar.jsx         # [TV 2] Bộ lọc chất liệu & giá
│   │   │   │   ├── 📄 CartDrawer.jsx            # [TV 3] Giỏ hàng trượt mini
│   │   │   │   ├── 📄 EcoCounter.jsx            # [TV 6] Widget đếm số lượng CO2 đã giảm
│   │   │   │   └── 📄 EcoScoreBadge.jsx         # [TV 6] Huy hiệu chứng nhận xanh
│   │   │   └── 📁 admin/                        # COMPONENT PHÍA QUẢN TRỊ
│   │   │       ├── 📄 AdminSidebar.jsx          # [TV 5] Menu điều hướng Admin
│   │   │       ├── 📄 StatCard.jsx              # [TV 5] Thẻ thống kê KPI doanh số/rác
│   │   │       └── 📄 RevenueChart.jsx          # [TV 5] Biểu đồ doanh thu Recharts
│   │   │
│   │   ├── 📁 services/                         # HÀM GỌI API BẰNG AXIOS
│   │   │   ├── 📄 auth.api.js                   # [TV 1] Gọi API đăng nhập, đăng ký, profile
│   │   │   ├── 📄 product.api.js                # [TV 2] Gọi API lấy sản phẩm, lọc, review
│   │   │   ├── 📄 order.api.js                  # [TV 3] Gọi API giỏ hàng, đặt hàng
│   │   │   └── 📄 vnpay.api.js                  # [TV 4] Gọi API lấy link thanh toán
│   │   │
│   │   ├── 📁 hooks/                            # CUSTOM HOOKS
│   │   │   ├── 📄 useProducts.js                # [TV 2] Hook fetch & cache sản phẩm
│   │   │   ├── 📄 useDebounce.js                # [TV 2] Hook chống spam ô tìm kiếm
│   │   │   └── 📄 useCart.js                    # [TV 3] Hook quản lý giỏ hàng Zustand
│   │   │
│   │   └── 📁 lib/                              # THƯ VIỆN TIỆN ÍCH
│   │       ├── 📄 axios.js                      # [TV 7] Cấu hình Axios gắn JWT Token
│   │       └── 📄 utils.js                      # [TV 7] Format tiền VNĐ, format ngày tháng
│   │
│   ├── 📄 tailwind.config.js                    # [TV 7] Khai báo bảng màu xanh Emerald & Forest
│   ├── 📄 package.json                          # [TV 7] Danh sách thư viện Frontend
│   └── 📄 .env.local                            # [TV 7] Biến môi trường kết nối Backend
