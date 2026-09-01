// [TV 1] Kiểm tra JWT Token đăng nhập
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Không tìm thấy token xác thực.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true, isVerified: true },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Người dùng không tồn tại.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Tài khoản chưa được xác thực email.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token đã hết hạn.' });
    }
    return res.status(401).json({ success: false, message: 'Token không hợp lệ.' });
  }
};
