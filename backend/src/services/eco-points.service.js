// [TV 6] Thuật toán tích/đổi Điểm Xanh
import prisma from '../config/db.js';

// 1 Điểm Xanh = 1000 VNĐ
const POINTS_PER_VND = 1 / 10000; // 1 Điểm mỗi 10.000 VNĐ
const POINTS_REDEEM_RATE = 1000;   // 1 Điểm = 1000 VNĐ khi đổi

/**
 * Tính điểm xanh kiếm được từ đơn hàng
 */
export const calculateEarnedPoints = (totalAmount) => {
  return Math.floor(totalAmount * POINTS_PER_VND);
};

/**
 * Tính giá trị VNĐ khi đổi điểm
 */
export const calculateRedeemValue = (points) => {
  return points * POINTS_REDEEM_RATE;
};

/**
 * Cộng điểm xanh sau khi đơn hàng hoàn thành
 */
export const earnPoints = async (userId, orderId, totalAmount) => {
  const points = calculateEarnedPoints(totalAmount);
  if (points <= 0) return;

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { ecoPoints: { increment: points } } }),
    prisma.ecoTransaction.create({
      data: { userId, type: 'EARN', points, description: `Tích điểm từ đơn hàng #${orderId.slice(-8).toUpperCase()}` },
    }),
  ]);

  return points;
};

/**
 * Đổi điểm xanh lấy voucher
 */
export const redeemPoints = async (userId, points) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.ecoPoints < points) throw Object.assign(new Error('Không đủ Điểm Xanh để đổi.'), { statusCode: 400 });

  const vndValue = calculateRedeemValue(points);

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { ecoPoints: { decrement: points } } }),
    prisma.ecoTransaction.create({
      data: { userId, type: 'REDEEM', points: -points, description: `Đổi ${points} Điểm Xanh lấy ${vndValue.toLocaleString('vi-VN')} VNĐ` },
    }),
  ]);

  return vndValue;
};

/**
 * Lấy lịch sử giao dịch điểm xanh
 */
export const getEcoHistory = async (userId) => {
  return prisma.ecoTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
};
