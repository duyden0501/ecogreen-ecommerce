// [TV 3] Transaction tạo đơn & trừ tồn kho
import prisma from '../config/db.js';
import { clearCart } from './cart.service.js';
import { calculateCo2Saved } from '../utils/eco_calc.util.js';

export const createOrder = async (userId, { paymentMethod, shippingAddress, voucherCode }) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (cartItems.length === 0) throw Object.assign(new Error('Giỏ hàng trống.'), { statusCode: 400 });

  // Kiểm tra tồn kho
  for (const item of cartItems) {
    if (item.product.stock < item.quantity) {
      throw Object.assign(new Error(`Sản phẩm "${item.product.name}" không đủ hàng.`), { statusCode: 400 });
    }
  }

  let totalAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalCo2Saved = calculateCo2Saved(cartItems);

  // Áp dụng voucher nếu có
  if (voucherCode) {
    const voucher = await prisma.voucher.findUnique({ where: { code: voucherCode } });
    if (voucher && voucher.isActive && new Date() < voucher.expiresAt && totalAmount >= voucher.minOrder) {
      if (voucher.type === 'PERCENT') totalAmount *= (1 - voucher.discount / 100);
      else totalAmount -= voucher.discount;
      await prisma.voucher.update({ where: { code: voucherCode }, data: { usedCount: { increment: 1 } } });
    }
  }

  // Transaction: Tạo đơn + trừ kho
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        paymentMethod,
        shippingAddress,
        totalAmount: Math.round(totalAmount),
        totalCo2Saved,
        paymentStatus: paymentMethod === 'COD' ? 'PENDING_COD' : 'UNPAID',
        orderItems: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { orderItems: { include: { product: { select: { name: true } } } } },
    });

    // Trừ tồn kho
    await Promise.all(
      cartItems.map((item) =>
        tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );

    return newOrder;
  });

  // Xóa giỏ hàng sau khi đặt thành công
  await clearCart(userId);

  return order;
};

export const getUserOrders = async (userId, { page, limit, status }) => {
  const where = { userId, ...(status && { status }) };
  const [orders, total] = await Promise.all([
    prisma.order.findMany({ where, include: { orderItems: { include: { product: { select: { name: true, images: true } } } } }, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.order.count({ where }),
  ]);
  return { data: orders, pagination: { page, limit, total } };
};

export const getOrderById = async (id, userId) => {
  return prisma.order.findFirst({
    where: { id, ...(userId && { userId }) },
    include: { orderItems: { include: { product: true } }, user: { select: { name: true, email: true } } },
  });
};

export const cancelOrder = async (id, userId) => {
  const order = await prisma.order.findFirst({ where: { id, userId } });
  if (!order) throw Object.assign(new Error('Đơn hàng không tồn tại.'), { statusCode: 404 });
  if (!['PENDING', 'CONFIRMED'].includes(order.status)) throw Object.assign(new Error('Không thể hủy đơn hàng ở trạng thái này.'), { statusCode: 400 });

  return prisma.order.update({ where: { id }, data: { status: 'CANCELLED' } });
};

export const getAllOrders = async ({ page, limit, status }) => {
  const where = status ? { status } : {};
  const [orders, total] = await Promise.all([
    prisma.order.findMany({ where, include: { user: { select: { name: true, email: true } } }, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.order.count({ where }),
  ]);
  return { data: orders, pagination: { page, limit, total } };
};

export const updateOrderStatus = async (id, status) => {
  return prisma.order.update({ where: { id }, data: { status } });
};
