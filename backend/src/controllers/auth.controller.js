// [TV 1] Xử lý Đăng ký, Đăng nhập, OTP
import * as authService from '../services/auth.service.js';
import * as mailService from '../services/mail.service.js';
import { generateToken } from '../utils/jwt.util.js';

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const user = await authService.registerUser({ name, email, password, phone });

    // Gửi OTP qua email
    await mailService.sendOtpEmail(user.email, user.otpCode);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực OTP.',
      data: { id: user.id, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/verify-otp
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await authService.verifyOtp(email, otp);
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Xác thực email thành công!',
      data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, ecoPoints: user.ecoPoints } },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/resend-otp
export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const otpCode = await authService.regenerateOtp(email);
    await mailService.sendOtpEmail(email, otpCode);

    res.json({ success: true, message: 'Mã OTP mới đã được gửi vào email của bạn.' });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ success: true, data: req.user });
};
