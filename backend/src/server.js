// [TV 7] File chính chạy Backend Port 5000
import 'dotenv/config';
import app from './app.js';
import prisma from './config/db.js';
import redis from './config/redis.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Kiểm tra kết nối Database
    await prisma.$connect();
    console.log('✅ Kết nối PostgreSQL thành công!');

    // Kết nối Redis
    await redis.connect();

    // Khởi chạy server
    app.listen(PORT, () => {
      console.log(`\n🌿 ================================`);
      console.log(`   EcoGreen API đang chạy!`);
      console.log(`   🌐 http://localhost:${PORT}`);
      console.log(`   📊 Health: http://localhost:${PORT}/health`);
      console.log(`   🌿 ================================\n`);
    });
  } catch (error) {
    console.error('❌ Khởi chạy server thất bại:', error);
    process.exit(1);
  }
};

// Xử lý tắt server an toàn
process.on('SIGINT', async () => {
  console.log('\n⚠️  Đang tắt server...');
  await prisma.$disconnect();
  redis.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  redis.disconnect();
  process.exit(0);
});

startServer();
