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
