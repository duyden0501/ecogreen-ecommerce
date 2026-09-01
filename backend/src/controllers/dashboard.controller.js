// [TV 5] API thống kê doanh thu, đơn hàng, CO2
import prisma from '../config/db.js';

// GET /api/admin/dashboard
export const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalRevenue,
      monthlyRevenue,
      totalOrders,
      pendingOrders,
      totalUsers,
      totalProducts,
      totalCo2Saved,
    ] = await Promise.all([
      prisma.order.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { totalAmount: true } }),
      prisma.order.aggregate({ where: { paymentStatus: 'PAID', createdAt: { gte: startOfMonth } }, _sum: { totalAmount: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { totalCo2Saved: true } }),
    ]);

    // Doanh thu 7 ngày gần nhất
    const last7Days = await prisma.$queryRaw`
      SELECT DATE(created_at) as date, SUM(total_amount) as revenue
      FROM orders
      WHERE payment_status = 'PAID' AND created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    res.json({
      success: true,
      data: {
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        monthlyRevenue: monthlyRevenue._sum.totalAmount || 0,
        totalOrders,
        pendingOrders,
        totalUsers,
        totalProducts,
        totalCo2Saved: totalCo2Saved._sum.totalCo2Saved || 0,
        revenueChart: last7Days,
      },
    });
  } catch (error) {
    next(error);
  }
};
