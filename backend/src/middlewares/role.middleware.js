// [TV 1] Phân quyền Admin / Customer
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền truy cập tài nguyên này.',
    });
  }
  next();
};

export const requireCustomer = (req, res, next) => {
  if (!req.user || req.user.role !== 'CUSTOMER') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ khách hàng mới có quyền thực hiện hành động này.',
    });
  }
  next();
};
