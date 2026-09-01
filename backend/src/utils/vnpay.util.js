// [TV 4] Hàm băm mã bảo mật SHA-512 VNPay
import crypto from 'crypto';
import qs from 'querystring';
import vnpayConfig from '../config/vnpay.config.js';

/**
 * Tạo chữ ký HMAC-SHA512 cho VNPay
 * @param {string} secret - Khóa bí mật VNPay
 * @param {string} data - Chuỗi dữ liệu cần ký
 * @returns {string} Chuỗi hex hash
 */
export const createHmacSHA512 = (secret, data) => {
  return crypto.createHmac('sha512', secret).update(Buffer.from(data, 'utf-8')).digest('hex');
};

/**
 * Xác minh chữ ký từ VNPay callback
 * @param {Object} query - Query params từ VNPay redirect / IPN
 * @returns {{ isValid: boolean, vnpResponseCode: string, vnpTxnRef: string, vnpAmount: string }}
 */
export const verifyVnpaySignature = (query) => {
  const { vnp_SecureHash, ...params } = query;

  // Xóa tất cả params rỗng
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== undefined)
  );

  const sortedParams = Object.fromEntries(Object.entries(filteredParams).sort());
  const signData = qs.stringify(sortedParams, { encode: false });
  const expectedHash = createHmacSHA512(vnpayConfig.hashSecret, signData);

  return {
    isValid: expectedHash === vnp_SecureHash,
    vnpResponseCode: params.vnp_ResponseCode,
    vnpTxnRef: params.vnp_TxnRef,
    vnpAmount: params.vnp_Amount,
  };
};
