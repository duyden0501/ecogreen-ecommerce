// [TV 1] Hàm sinh & giải mã JWT Token
import jwt from 'jsonwebtoken';

/**
 * Sinh JWT Token
 * @param {string} userId
 * @param {string} expiresIn - Ví dụ: '7d', '1h'
 */
export const generateToken = (userId, expiresIn = process.env.JWT_EXPIRES_IN || '7d') => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Giải mã JWT Token
 * @param {string} token
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
