-- =====================================================================
-- EcoGreen E-Commerce - Seed Data Script
-- Dữ liệu mẫu chuẩn hóa từ bộ dataset Amazon Eco-Friendly Products
-- =====================================================================

-- 1. Bật extension pgcrypto để sinh mật khẩu BCrypt chuẩn
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Đảm bảo 2 role hệ thống tồn tại
INSERT INTO roles (name) VALUES ('USER'), ('ADMIN')
ON CONFLICT (name) DO NOTHING;

-- 3. Tạo tài khoản mẫu:
--    - admin / admin123 (quản trị viên, có role ADMIN + USER)
--    - khachhang / 123456 (khách mua hàng, có role USER)
INSERT INTO users (username, email, password, is_active, created_at, updated_at)
VALUES 
  ('admin', 'admin@ecogreen.vn', crypt('admin123', gen_salt('bf', 10)), TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('khachhang', 'khachhang@ecogreen.vn', crypt('123456', gen_salt('bf', 10)), TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;

-- 4. Phân quyền trong bảng user_roles
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE (u.username = 'admin' AND r.name IN ('USER', 'ADMIN'))
   OR (u.username = 'khachhang' AND r.name = 'USER')
ON CONFLICT DO NOTHING;

-- 5. Tạo giỏ hàng gắn với mỗi tài khoản (quan hệ 1-1)
INSERT INTO carts (user_id, created_at, updated_at)
SELECT u.id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u
WHERE u.username IN ('admin', 'khachhang')
  AND NOT EXISTS (SELECT 1 FROM carts c WHERE c.user_id = u.id);

-- 6. Xóa danh mục và sản phẩm cũ nếu có để nạp lại mới nhất
DELETE FROM cart_items;
DELETE FROM order_items;
DELETE FROM payments;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM categories;

-- Reset sequence nếu có
ALTER SEQUENCE IF EXISTS categories_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS products_id_seq RESTART WITH 1;

-- 7. Danh mục sản phẩm tiếng Việt chuẩn
INSERT INTO categories (id, name, description) VALUES
  (1, 'Nhà Bếp & Gia Dụng Sinh Thái', 'Đồ dùng nhà bếp, bình giữ nhiệt, khăn và thảm gia đình từ sợi đay và chất liệu tự nhiên bền vững.'),
  (2, 'Chăm Sóc Cá Nhân & Thảo Mộc', 'Sản phẩm chăm sóc cơ thể, viên xông tinh dầu, xà phòng hữu cơ và tăm bông thân tre không rác thải nhựa.'),
  (3, 'Chăm Sóc Gia Đình & Sức Khỏe', 'Bàn chải tre kháng khuẩn, túi giấy Kraft tái chế, túi quà vải đay dây rút và đồ dùng gia đình sinh học.'),
  (4, 'Nông Nghiệp Xanh & Sân Vườn', 'Vải địa kỹ thuật sinh học, lưới giàn leo tự nhiên, túi ươm cây và thảm xơ dừa giữ ẩm đất.')
ON CONFLICT (name) DO NOTHING;

-- Đồng bộ lại sequence categories
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- 8. Thêm 24 sản phẩm sống xanh chất lượng cao
INSERT INTO products (category_id, name, description, price, stock_quantity, image, status) VALUES
  (1, 'Ly giữ nhiệt Inox chân không Eco Tumbler 1200ml', 'Bình giữ nhiệt Inox 304 cao cấp hai lớp chân không dung tích 1200ml. Giữ nóng 12h, giữ lạnh 24h, kèm ống hút inox và nắp chống tràn. Chất liệu thân thiện môi trường, tái sử dụng hàng ngày.', 550000, 45, 'https://m.media-amazon.com/images/I/61qHPD-Xr5L.__AC_SX300_SY300_QL70_ML2_.jpg', 'ACTIVE'),
  (1, 'Khăn trải bàn sợi đay tự nhiên phong cách Vintage', 'Khăn trải bàn dệt từ 100% sợi đay tự nhiên mộc mạc, tạo điểm nhấn ấm cúng cho bàn ăn gia đình và quán cafe phong cách Eco-living.', 320000, 60, 'https://m.media-amazon.com/images/I/81gYGN3acnS.__AC_SX300_SY300_QL70_ML2_.jpg', 'ACTIVE'),
  (1, 'Bộ 4 dây buộc rèm cửa sợi đay tự nhiên kèm thanh gỗ', 'Bộ dây buộc rèm phong cách Bohemian làm từ sợi đay bện thủ công và gỗ mộc tự nhiên. Không cần khoan tường, độ bền cao và thân thiện môi trường.', 250000, 50, 'https://m.media-amazon.com/images/I/91OQZkPqdJL.__AC_SX300_SY300_QL70_ML2_.jpg', 'ACTIVE'),
  (1, 'Vỏ gối tựa lưng sợi đay phối len dệt tay thủ công', 'Vỏ gối trang trí sofa 45x45cm dệt tay từ 70% sợi đay và 30% len tự nhiên. Mang lại cảm giác mộc mạc, thoáng khí và thân thiện với làn da.', 280000, 35, 'https://m.media-amazon.com/images/I/81QHFFVYFGL.__AC_SX300_SY300_QL70_ML2_.jpg', 'ACTIVE'),
  (1, 'Thảm trải sàn sợi đay tự nhiên đan tròn thủ công 1.2m', 'Thảm tròn bện tay từ sợi đay tự nhiên cao cấp Safavieh, dày dặn, thấm hút tốt, phân hủy sinh học 100%, an toàn cho sức khỏe gia đình.', 650000, 25, 'https://m.media-amazon.com/images/I/A1Q73Cheh2S.__AC_SX300_SY300_QL70_ML2_.jpg', 'ACTIVE'),
  (1, 'Thảm chùi chân sợi đay tự nhiên bền chắc 55x150cm', 'Thảm sợi đay tự nhiên dệt dày dặn, dễ dàng gạt sạch bụi bẩn ở cửa ra vào. Sản phẩm 100% phân hủy tự nhiên, có thể ủ phân hữu cơ sau vòng đời sử dụng.', 290000, 80, 'https://m.media-amazon.com/images/I/81J055W0D2L.__AC_SX300_SY300_QL70_ML2_.jpg', 'ACTIVE'),
  (2, 'Hộp viên xông tinh dầu thảo mộc Body Restore (30 viên)', 'Viên xông phòng tắm chiết xuất từ tinh dầu thiên nhiên nguyên chất (khuynh diệp, hoa oải hương, tràm trà). Giúp xua tan mệt mỏi, thư giãn tinh thần và làm sạch đường hô hấp.', 450000, 40, 'https://m.media-amazon.com/images/I/71sI0Bkas5L.__AC_SX300_SY300_QL70_ML2_.jpg', 'ACTIVE'),
  (2, 'Bánh dầu xả dưỡng tóc dầu thầu dầu hữu cơ Kitsch', 'Dầu xả dạng bánh cô đặc không rác thải nhựa (Zero Waste). Chiết xuất dầu thầu dầu hữu cơ nuôi dưỡng chân tóc chắc khỏe, mềm mượt tự nhiên.', 280000, 65, 'https://m.media-amazon.com/images/I/41dlMMRzoZL._SX300_SY300_QL70_ML2_.jpg', 'ACTIVE'),
  (2, 'Bơ massage dưỡng ẩm toàn thân chiết xuất dầu dừa hữu cơ', 'Bơ dưỡng thể thuần chay hữu cơ từ dầu dừa và bơ hạt mỡ nguyên chất. Khóa ẩm sâu, phục hồi làn da khô ráp mà không nhờn rít.', 350000, 50, 'https://m.media-amazon.com/images/I/41GkPgrHncL._SX300_SY300_QL70_ML2_.jpg', 'ACTIVE'),
  (2, 'Hộp tăm bông thân tre bọc cotton hữu cơ Sky Organics (375 que)', 'Tăm bông 100% sợi bông hữu cơ mềm mại với thân que bằng tre tự nhiên thay thế que nhựa, tự phân hủy hoàn toàn, an toàn cho tai và da nhạy cảm.', 120000, 120, 'https://m.media-amazon.com/images/I/41Q-Zygzd2L._SX300_SY300_QL70_ML2_.jpg', 'ACTIVE'),
  (2, 'Xà bông cạo râu tự nhiên dưỡng ẩm Kitsch cho da nhạy cảm', 'Bánh xà bông tạo bọt cạo râu hữu cơ không chứa hóa chất độc hại, làm mềm râu và bảo vệ bề mặt da không bị trầy xước, khô rát.', 160000, 75, 'https://m.media-amazon.com/images/I/417mSvQL8lL._SX300_SY300_QL70_ML2_.jpg', 'ACTIVE'),
  (2, 'Kẹp tóc càng cua nhựa tái chế sinh thái phong cách Marble', 'Kẹp tóc lớn thiết kế vân đá cẩm thạch sang trọng, chế tác từ 100% nhựa tái chế thân thiện môi trường, lò xo thép không gỉ chắc chắn.', 85000, 100, 'https://m.media-amazon.com/images/I/412-7p0BzLL._SX300_SY300_QL70_ML2_.jpg', 'ACTIVE'),
  (3, 'Bàn chải đánh răng tre sinh học bảo vệ môi trường (Set 2 cây)', 'Cặp bàn chải đôi với cán tre tự nhiên kháng khuẩn, lông chải than hoạt tính siêu mềm mịn giúp làm sạch mảng bám hiệu quả mà không hại nướu.', 95000, 150, 'https://m.media-amazon.com/images/I/41-8E6oC5oL.__AC_SX300_SY300_QL70_ML2_.jpg', 'ACTIVE'),
  (3, 'Set túi quà vải đay Hessian dây rút tái sử dụng (50 túi)', 'Túi vải đay tự nhiên có dây rút tiện lợi, đường may tỉ mỉ, thích hợp đựng trang sức, quà tặng sự kiện, đồ lưu niệm mộc mạc và bền đẹp.', 320000, 45, 'https://m.media-amazon.com/images/I/71DrHIU1aML.__AC_SX300_SY300_QL70_ML2_.jpg', 'ACTIVE'),
  (3, 'Set 50 túi giấy Kraft nâu có quai xách bảo vệ môi trường', 'Túi giấy xi măng Kraft tái chế dày dặn, đáy vuông chịu lực tốt, quai giấy xoắn chắc chắn, là giải pháp thay thế hoàn hảo cho túi nilon.', 220000, 80, 'https://m.media-amazon.com/images/I/715Rw-2on5L.__AC_SX300_SY300_QL70_ML2_.jpg', 'ACTIVE'),
  (3, 'Cuộn giấy gói quà Kraft tái chế họa tiết Vintage cổ điển', 'Giấy bọc quà sinh học chất liệu giấy Kraft tự nhiên in mực thực vật an toàn. Phong cách cổ điển sang trọng và ý nghĩa cho các dịp lễ tết.', 110000, 90, 'https://m.media-amazon.com/images/I/71H4Rm0ZljL.__AC_SY300_SX300_QL70_ML2_.jpg', 'ACTIVE'),
  (3, 'Mặt nạ ngủ giữ ẩm tự nhiên Eyeseals bảo vệ mắt ban đêm', 'Mặt nạ ngủ công thái học giữ ẩm vùng mắt, ngăn luồng gió khô từ điều hòa, mang lại giấc ngủ sâu và thư giãn cho mắt mỏi mệt.', 380000, 35, 'https://m.media-amazon.com/images/I/61Uz393xlpL.__AC_SY300_SX300_QL70_ML2_.jpg', 'ACTIVE'),
  (3, 'Set túi quà lễ hội giấy Kraft sinh học họa tiết đáng yêu (40 túi)', 'Bộ túi đựng quà tặng sinh thái với họa tiết tươi vui, chất liệu giấy tự hủy sinh học, góp phần giảm thiểu rác thải nhựa trong các dịp liên hoan.', 240000, 60, 'https://m.media-amazon.com/images/I/71qqw4RQwYL.__AC_SX300_SY300_QL70_ML2_.jpg', 'ACTIVE'),
  (4, 'Vải địa kỹ thuật sợi đay tự nhiên chống xói mòn Agfabric 15m', 'Lưới địa kỹ thuật dệt từ 100% sợi đay tự nhiên, giữ ẩm đất, chống xói mòn sườn dốc và tạo điều kiện lý tưởng cho rễ cây phát triển bền vững.', 480000, 30, 'https://m.media-amazon.com/images/I/71t3FD5KjHL.__AC_SY445_SX342_QL70_ML2_.jpg', 'ACTIVE'),
  (4, 'Túi vải bao bố tự phân hủy ươm cây trồng (Set 5 túi lớn)', 'Túi vải bố sợi đay sinh học chuyên dụng để ươm cây, làm đập cát chắn lũ hoặc bảo quản nông sản. Tự phân hủy thành chất mùn hữu cơ sau khi chôn.', 250000, 70, 'https://m.media-amazon.com/images/I/81q3el899UL.__AC_SY300_SX300_QL70_ML2_.jpg', 'ACTIVE'),
  (4, 'Thảm rơm và xơ dừa sinh học bảo vệ đất cảnh quan 100%', 'Thảm kết hợp 70% rơm lúa mì và 30% sợi xơ dừa hữu cơ ép chặt, che phủ bề mặt luống cây, hạn chế cỏ dại và giữ ấm cho hạt giống nảy mầm.', 520000, 25, 'https://m.media-amazon.com/images/I/71jfXXjGGKL.__AC_SY300_SX300_QL70_ML2_.jpg', 'ACTIVE'),
  (4, 'Cuộn vải đay tự nhiên mật độ cao VEVOR làm vườn và trang trí', 'Cuộn vải bố đay khổ 35cm x 45m tự nhiên không hóa chất độc hại, ứng dụng đa năng: bọc bảo vệ thân cây mùa đông, làm rào che chắn cây non.', 360000, 40, 'https://m.media-amazon.com/images/I/81io54RXqOL.__AC_SX300_SY300_QL70_ML2_.jpg', 'ACTIVE'),
  (4, 'Lưới sợi đay tự nhiên sinh học nâng đỡ cây leo sân vườn', 'Lưới giàn leo sinh thái đan từ sợi đay tự nhiên, mắt lưới 15x15cm, thích hợp cho cà chua, dưa leo, đậu cove leo giàn mà không cần dùng cước nhựa.', 190000, 90, 'https://m.media-amazon.com/images/I/71nvYT8-X+L._AC_SY300_SX300_.jpg', 'ACTIVE'),
  (4, 'Lưới đay phủ thảm cỏ sinh học giữ ẩm QuickGRASS 1.2x15m', 'Lưới đay dệt ô thưa giữ hạt cỏ không bị rửa trôi khi tưới nước, phân hủy tự nhiên thành phân bón hữu cơ nuôi cỏ xanh mướt sau vài tháng.', 380000, 35, 'https://m.media-amazon.com/images/I/91As0hjs-UL.__AC_SX300_SY300_QL70_ML2_.jpg', 'ACTIVE');

-- Đồng bộ lại sequence products
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
