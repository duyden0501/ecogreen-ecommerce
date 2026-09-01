// [TV 3] Lưu giỏ hàng vào DB & Redis
import prisma from '../config/db.js';
import redis from '../config/redis.js';

const CART_CACHE_TTL = 60 * 30; // 30 phút

const getCacheKey = (userId) => `cart:${userId}`;

export const getCart = async (userId) => {
  // Thử lấy từ Redis cache
  const cached = await redis.get(getCacheKey(userId));
  if (cached) return JSON.parse(cached);

  // Nếu không có cache, lấy từ DB
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: { select: { id: true, name: true, slug: true, price: true, images: true, stock: true, co2SavedPerUnit: true } } },
  });

  await redis.setex(getCacheKey(userId), CART_CACHE_TTL, JSON.stringify(cartItems));
  return cartItems;
};

export const addToCart = async (userId, productId, quantity) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) throw Object.assign(new Error('Sản phẩm không tồn tại.'), { statusCode: 404 });
  if (product.stock < quantity) throw Object.assign(new Error('Sản phẩm không đủ hàng trong kho.'), { statusCode: 400 });

  await prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: { quantity: { increment: quantity } },
    create: { userId, productId, quantity },
  });

  await redis.del(getCacheKey(userId)); // Xóa cache cũ
  return getCart(userId);
};

export const updateCartItem = async (userId, productId, quantity) => {
  if (quantity <= 0) return removeFromCart(userId, productId);

  await prisma.cartItem.update({
    where: { userId_productId: { userId, productId } },
    data: { quantity },
  });

  await redis.del(getCacheKey(userId));
  return getCart(userId);
};

export const removeFromCart = async (userId, productId) => {
  await prisma.cartItem.deleteMany({ where: { userId, productId } });
  await redis.del(getCacheKey(userId));
};

export const clearCart = async (userId) => {
  await prisma.cartItem.deleteMany({ where: { userId } });
  await redis.del(getCacheKey(userId));
};
