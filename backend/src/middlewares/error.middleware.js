// [TV 7] Bộ xử lý bắt lỗi tập trung
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  console.error('🔴 Error:', err.stack || err.message);

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: `Dữ liệu đã tồn tại: ${err.meta?.target?.join(', ')}`,
    });
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy dữ liệu yêu cầu.',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ.' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token đã hết hạn.' });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: err.message });
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Đã xảy ra lỗi máy chủ nội bộ.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy route: ${req.method} ${req.originalUrl}`,
  });
};
