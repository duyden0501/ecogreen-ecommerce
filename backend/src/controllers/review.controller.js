// [TV 2] Đánh giá & bình luận sản phẩm
import prisma from '../config/db.js';

// GET /api/products/:productId/reviews
export const getReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: req.params.productId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({ success: true, data: reviews, avgRating: Math.round(avgRating * 10) / 10, total: reviews.length });
  } catch (error) {
    next(error);
  }
};

// POST /api/products/:productId/reviews
export const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const review = await prisma.review.create({
      data: { userId: req.user.id, productId: req.params.productId, rating: Number(rating), comment },
      include: { user: { select: { name: true } } },
    });
    res.status(201).json({ success: true, message: 'Cảm ơn bạn đã đánh giá!', data: review });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/reviews/:id
export const deleteReview = async (req, res, next) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review) return res.status(404).json({ success: false, message: 'Đánh giá không tồn tại.' });
    if (review.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Không có quyền xóa đánh giá này.' });
    }
    await prisma.review.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Đã xóa đánh giá.' });
  } catch (error) {
    next(error);
  }
};
