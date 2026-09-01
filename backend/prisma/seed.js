// [TV 2] Script nạp dữ liệu sản phẩm tái chế mẫu
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu EcoGreen...');

  // ── Tạo Categories ───────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'thoi-trang' },
      update: {},
      create: { name: 'Thời Trang Xanh', slug: 'thoi-trang', description: 'Quần áo từ vải tái chế' },
    }),
    prisma.category.upsert({
      where: { slug: 'gia-dung' },
      update: {},
      create: { name: 'Gia Dụng Xanh', slug: 'gia-dung', description: 'Đồ dùng nhà bếp thân thiện môi trường' },
    }),
    prisma.category.upsert({
      where: { slug: 'van-phong' },
      update: {},
      create: { name: 'Văn Phòng Xanh', slug: 'van-phong', description: 'Dụng cụ văn phòng từ vật liệu tái chế' },
    }),
  ]);

  console.log('✅ Categories đã tạo:', categories.length);

  // ── Tạo Admin Account ────────────────────────
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ecogreen.vn' },
    update: {},
    create: {
      email: 'admin@ecogreen.vn',
      password: hashedPassword,
      name: 'EcoGreen Admin',
      role: 'ADMIN',
      isVerified: true,
    },
  });

  console.log('✅ Admin account:', admin.email);

  // ── Tạo Products mẫu ─────────────────────────
  const products = [
    {
      name: 'Áo Thun Vải Tre Organic',
      slug: 'ao-thun-vai-tre-organic',
      description: 'Áo thun làm từ 100% sợi tre tự nhiên, mềm mại, kháng khuẩn và thân thiện môi trường.',
      price: 299000,
      stock: 50,
      images: ['https://placehold.co/800x800/2d6a4f/white?text=Áo+Tre'],
      material: 'Sợi Tre',
      recycledPercent: 100,
      co2SavedPerUnit: 2.5,
      ecoScore: 95,
      categoryId: categories[0].id,
    },
    {
      name: 'Túi Tote Vải Bã Cà Phê',
      slug: 'tui-tote-vai-ba-ca-phe',
      description: 'Túi tote thời trang làm từ vải tái chế bã cà phê, khử mùi tự nhiên.',
      price: 189000,
      stock: 80,
      images: ['https://placehold.co/800x800/40916c/white?text=Túi+Tote'],
      material: 'Vải Bã Cà Phê',
      recycledPercent: 70,
      co2SavedPerUnit: 1.8,
      ecoScore: 88,
      categoryId: categories[0].id,
    },
    {
      name: 'Hộp Đựng Thức Ăn Bã Mía',
      slug: 'hop-dung-thuc-an-ba-mia',
      description: 'Hộp đựng thức ăn sinh học phân hủy hoàn toàn làm từ bã mía.',
      price: 45000,
      stock: 200,
      images: ['https://placehold.co/800x800/52b788/white?text=Hộp+Bã+Mía'],
      material: 'Bã Mía',
      recycledPercent: 100,
      co2SavedPerUnit: 0.8,
      ecoScore: 92,
      categoryId: categories[1].id,
    },
    {
      name: 'Bút Bi Từ Chai PET Tái Chế',
      slug: 'but-bi-chai-pet-tai-che',
      description: 'Bộ bút bi thân thiện môi trường được sản xuất từ chai nhựa PET tái chế.',
      price: 35000,
      stock: 300,
      images: ['https://placehold.co/800x800/74c69d/white?text=Bút+PET'],
      material: 'Nhựa PET Tái Chế',
      recycledPercent: 85,
      co2SavedPerUnit: 0.3,
      ecoScore: 80,
      categoryId: categories[2].id,
    },
    {
      name: 'Bình Nước Inox Giữ Nhiệt',
      slug: 'binh-nuoc-inox-giu-nhiet',
      description: 'Bình nước inox 500ml tái sử dụng, thay thế 500 chai nhựa mỗi năm.',
      price: 259000,
      stock: 100,
      images: ['https://placehold.co/800x800/1b4332/white?text=Bình+Inox'],
      material: 'Inox 304',
      recycledPercent: 40,
      co2SavedPerUnit: 5.2,
      ecoScore: 90,
      categoryId: categories[1].id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log('✅ Sản phẩm mẫu đã tạo:', products.length);

  // ── Tạo Vouchers mẫu ─────────────────────────
  await prisma.voucher.upsert({
    where: { code: 'ECOGREEN10' },
    update: {},
    create: {
      code: 'ECOGREEN10',
      discount: 10,
      type: 'PERCENT',
      minOrder: 200000,
      maxUses: 100,
      expiresAt: new Date('2025-12-31'),
    },
  });

  console.log('✅ Voucher mẫu đã tạo: ECOGREEN10');
  console.log('🎉 Seed hoàn tất!');
}

main()
  .catch((e) => {
    console.error('❌ Seed thất bại:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
