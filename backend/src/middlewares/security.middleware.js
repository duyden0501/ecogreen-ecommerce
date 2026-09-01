// [TV 7] Chống DDoS, Helmet, CORS
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// ── Helmet: Bảo vệ HTTP Headers ───────────────
export const helmetMiddleware = helmet();

// ── CORS: Chỉ cho phép frontend truy cập ─────
export const corsMiddleware = cors({
  origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// ── Rate Limit: Chống spam request ───────────
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100,                  // tối đa 100 request / window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút.',
  },
});

// ── Auth Rate Limit: Nghiêm ngặt hơn cho login ─
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Quá nhiều lần đăng nhập thất bại, vui lòng thử lại sau.',
  },
});
