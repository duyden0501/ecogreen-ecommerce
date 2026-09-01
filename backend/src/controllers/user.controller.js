// [TV 1] Quản lý thông tin tài khoản người dùng
import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';

// GET /api/users/profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, phone: true, address: true, ecoPoints: true, role: true, createdAt: true },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, phone, address },
      select: { id: true, name: true, email: true, phone: true, address: true },
    });
    res.json({ success: true, message: 'Cập nhật thông tin thành công!', data: updated });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/change-password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không đúng.' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } });

    res.json({ success: true, message: 'Đổi mật khẩu thành công!' });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users — [Admin Only]
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const where = role ? { role } : {};
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: Number(limit),
        select: { id: true, name: true, email: true, role: true, ecoPoints: true, isVerified: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);
    res.json({ success: true, data: users, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (error) {
    next(error);
  }
};
