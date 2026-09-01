// [TV 4] Xử lý Webhook IPN ngân hàng
import * as vnpayService from '../services/vnpay.service.js';
import { verifyVnpaySignature } from '../utils/vnpay.util.js';

// POST /api/payment/vnpay/create-url
export const createPaymentUrl = async (req, res, next) => {
  try {
    const { orderId, amount, orderInfo } = req.body;
    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const paymentUrl = vnpayService.createPaymentUrl({ orderId, amount, orderInfo, ipAddr });
    res.json({ success: true, data: { paymentUrl } });
  } catch (error) {
    next(error);
  }
};

// GET /api/payment/vnpay/return — Redirect từ VNPay
export const vnpayReturn = async (req, res, next) => {
  try {
    const { isValid, vnpResponseCode, vnpTxnRef } = verifyVnpaySignature(req.query);
    if (isValid && vnpResponseCode === '00') {
      await vnpayService.confirmPayment(vnpTxnRef);
      res.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/payment-result?status=success&txn=${vnpTxnRef}`);
    } else {
      res.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/payment-result?status=failed&code=${vnpResponseCode}`);
    }
  } catch (error) {
    next(error);
  }
};

// POST /api/payment/vnpay/ipn — IPN Webhook từ ngân hàng
export const vnpayIpn = async (req, res, next) => {
  try {
    const { isValid, vnpResponseCode, vnpTxnRef, vnpAmount } = verifyVnpaySignature(req.query);

    if (!isValid) {
      return res.json({ RspCode: '97', Message: 'Invalid signature' });
    }

    const result = await vnpayService.processIpn({ vnpResponseCode, vnpTxnRef, vnpAmount });
    res.json(result);
  } catch (error) {
    next(error);
  }
};
