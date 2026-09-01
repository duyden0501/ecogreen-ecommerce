// [TV 1] Mã hóa Bcrypt, ký JWT Token
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../config/db.js';

export const registerUser = async ({ name, email, password, phone }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Email này đã được đăng ký.');
    err.statusCode = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, 10);
  const otpCode = crypto.randomInt(100000, 999999).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

  return prisma.user.create({
    data: { name, email, password: hashed, phone, otpCode, otpExpiry },
  });
};

export const verifyOtp = async (email, otp) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw Object.assign(new Error('Tài khoản không tồn tại.'), { statusCode: 404 });
  if (user.isVerified) throw Object.assign(new Error('Tài khoản đã được xác thực.'), { statusCode: 400 });
  if (user.otpCode !== otp) throw Object.assign(new Error('Mã OTP không đúng.'), { statusCode: 400 });
  if (new Date() > user.otpExpiry) throw Object.assign(new Error('Mã OTP đã hết hạn.'), { statusCode: 400 });

  return prisma.user.update({
    where: { email },
    data: { isVerified: true, otpCode: null, otpExpiry: null },
  });
};

export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw Object.assign(new Error('Email hoặc mật khẩu không đúng.'), { statusCode: 401 });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw Object.assign(new Error('Email hoặc mật khẩu không đúng.'), { statusCode: 401 });

  if (!user.isVerified) throw Object.assign(new Error('Vui lòng xác thực email trước khi đăng nhập.'), { statusCode: 403 });

  return user;
};

export const regenerateOtp = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw Object.assign(new Error('Email không tồn tại.'), { statusCode: 404 });
  if (user.isVerified) throw Object.assign(new Error('Tài khoản đã được xác thực.'), { statusCode: 400 });

  const otpCode = crypto.randomInt(100000, 999999).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({ where: { email }, data: { otpCode, otpExpiry } });
  return otpCode;
};
